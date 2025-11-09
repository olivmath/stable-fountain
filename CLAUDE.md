# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Peggy** is an admin-managed BRL stablecoin system backed by a global XRP pool. It provides a regulated on-ramp/off-ramp between fiat (Brazilian Real via PIX) and BRL tokens on the XRP Ledger.

### Key Difference from Original Peggy

**Original Peggy**: Each user creates an individual over-collateralized vault, deposits their own XRP, receives stablecoins independently. Decentralized model with liquidation mechanics.

**New Peggy (this version)**: Single global XRP pool managed by an admin. Admin is the only entity that interacts with the hook to mint/burn tokens. Users never directly touch the blockchain - they receive/use BRL tokens and can transfer between themselves. Admin handles all on/off-ramp operations via PIX.

### Use Case

- **Compliance-focused**: Admin does KYC/AML, clients don't need Xahau accounts initially
- **Simple UX**: Users see BRL tokens like traditional e-money, not crypto
- **Pooled liquidity**: Better capital efficiency than individual vaults
- **On-Ramp/Off-Ramp**: Seamless conversion between PIX (fiat) and BRL tokens

## Core Architecture

### Three-Tier Structure

1. **Fiat Layer (Off-Chain)**: PIX payments between clients and admin
2. **Token Layer (On-Chain)**: BRL tokens on XRPL, transferable between users
3. **Collateral Layer (On-Chain)**: Global XRP pool, secured in hook smart contract

### Data Flow

```
MINT (Fiat → BRL):
Client PIX → Admin → Admin deposits XRP via hook → Hook issues BRL → User receives BRL

RESGATE (BRL → Fiat):
User sends BRL → Admin → Admin burns BRL via hook → Hook returns XRP → Admin PIX payment
```

### Pool State

**Hook State**: Single storage entry `"GLOBAL_POOL"` (11 bytes key)
- **Value**: 16 bytes total
  - Bytes 0-7: `pool_xrp` (XFL float - total XRP collateral)
  - Bytes 8-15: `pool_brl` (XFL float - total BRL tokens issued)

**Pool Ratio**: Must maintain (pool_xrp × exchange_rate) / pool_brl ≥ 1.5 (150%)

### Collateralization

- **150%**: Minimum safe ratio. New BRL emissions check this before allowing issuance.
- **120%**: Emergency threshold. If pool drops below this, admin must add XRP urgently.
- **Formula**: `Ratio = (Total XRP drops × BRL/XRP rate) / Total BRL issued`

**Example**:
```
Pool: 1000 XRP, exchange rate 150 BRL/XRP → 150,000 BRL collateral value
Issued: 100,000 BRL tokens
Ratio: 150,000 / 100,000 = 1.5 = 150% ✅ Exactly at minimum

If ratio < 1.5: Hook rejects new mint operations
If ratio < 1.2: Emergency mode (admin critical action needed)
```

## Code Structure

### src/peggy.c

**Main entry point**: `int64_t hook(uint32_t reserved)`

**Key sections**:

1. **Initialization** (lines 30-90):
   - Get hook account and transaction sender
   - Validate sender is admin (reject if not)
   - Load admin account from hook parameters
   - Load oracle trustline, get exchange rate

2. **Pool Loading** (lines 92-101):
   - Load global pool state from `"GLOBAL_POOL"` key
   - Initialize pool_xrp and pool_brl if new pool

3. **Amount Processing** (lines 104-124):
   - Extract transaction amount and type (XRP vs BRL)
   - Get beneficiary from InvoiceID field (20 bytes)

4. **Admin Mint Path** (lines 126-176):
   - Validates admin is sending XRP
   - Checks collateral ratio won't drop below 150%
   - Calculates BRL to issue: `amount_xrp × exchange_rate × (2/3)`
   - Updates pool state
   - Emits BRL payment to beneficiary

5. **Admin Burn Path** (lines 178-228):
   - Validates admin is sending BRL
   - Checks BRL is issued by this hook
   - Calculates XRP to return: `amount_brl / exchange_rate`
   - Validates pool has sufficient XRP
   - Updates pool state
   - Emits XRP payment back to admin

### src/include/ Headers

- **hookapi.h**: Official XRPL Hook API (functions, constants, keylet types)
- **macro.h**: Helper macros (TRACEVAR, ASSERT, float operations)
- **extern.h**: External C function declarations
- **error.h**: Error code definitions
- **sfcodes.h**: Serialized field codes (sfAmount, sfAccount, etc)
- **data.h**: Data structure definitions

### scripts/

**Setup Scripts**:
- **decode.js**: Convert XRPL addresses to binary (for oracle accounts)
- **trust-user.js**: User configures trustline to receive BRL tokens
- **trust-oracle.js**: Oracle accounts establish trustline (determines exchange rate)

**Operation Scripts** (NEW):
- **admin-mint.js**: Admin deposits XRP, issues BRL to beneficiary
  - Input: admin_secret, hook_account, xrp_amount, beneficiary_account
  - Output: BRL tokens sent to beneficiary

- **admin-burn.js**: Admin burns BRL, receives XRP
  - Input: admin_secret, hook_account, brl_amount, beneficiary_account
  - Output: XRP sent back to admin

## Key Implementation Details

### Admin-Only Operations

All blockchain interactions are admin-only:
```c
// Line 52-55: Validate sender is admin
int is_admin = 0;
BUFFER_EQUAL(is_admin, admin_accid, otxn_accid, 20);
if (!is_admin)
    rollback(SBUF("Peggy: Only admin can interact with this hook"), 1);
```

No direct user transactions to hook allowed.

### BRL Issuance Logic

```c
// Line 139-145: Calculate BRL at 150% collateralization
int64_t brl_to_issue = float_multiply(amt, exchange_rate);
brl_to_issue = float_mulratio(brl_to_issue, 0,
    NEW_COLLATERALIZATION_NUMERATOR,      // 2
    NEW_COLLATERALIZATION_DENOMINATOR);   // 3
pool_brl = float_sum(pool_brl, brl_to_issue);
```

Multiplies XRP amount by exchange rate, then applies 2/3 ratio (150% collateral).

### BRL Redemption Logic

```c
// Line 200-209: Calculate XRP to return, burn BRL
int64_t xrp_to_return = float_divide(amt, exchange_rate);
// Validate pool has enough XRP...
pool_brl = float_sum(pool_brl, float_negate(amt));
pool_xrp = float_sum(pool_xrp, float_negate(xrp_to_return));
```

Divides BRL amount by exchange rate to get XRP, updates pool.

### Oracle System

Trustline between oracle_lo and oracle_hi:
```c
// Line 74-76: Generate keylet for oracle trustline
util_keylet(SBUF(keylet), KEYLET_LINE,
    oracle_lo, 20, oracle_hi, 20, SBUF(currency));
```

The **sfLowLimit** of this trustline represents the BRL/XRP exchange rate (e.g., 150 = 150 BRL per XRP).

### Beneficiary Tracking

Admin specifies which user gets tokens via InvoiceID:
```c
// Line 122-124: Extract beneficiary from InvoiceID
uint8_t beneficiary[20];
int64_t invoice_id_len = otxn_field(SBUF(beneficiary), sfInvoiceID);
```

InvoiceID must be exactly 20 bytes (XRPL account ID in binary).

## Important Differences from Original Peggy

| Aspect | Original Peggy | New Peggy |
|--------|--------|----------|
| **Vaults** | Per-user, isolated | Single global pool |
| **Collateral** | Individual ratios | Pool-wide ratio |
| **Users** | Direct blockchain interaction | No hook interaction |
| **Admin** | Not present | Central authority |
| **Liquidation** | Automated takeover logic | Admin responsibility |
| **Currency** | USD | BRL |
| **Access** | Public (per-user) | Permissioned (admin-only) |
| **On-Ramp** | User deposits XRP | Admin deposits XRP |
| **Off-Ramp** | User sends USD back | Admin burns BRL |

## Removed Components

- **source_tag tracking**: No per-user identification needed (admin tracks off-chain)
- **invoice_id takeover logic**: No liquidation mechanics (admin manages collateral)
- **USD currency**: Completely replaced with BRL
- **Trustline limit validation**: No per-user trustline size validation
- **Individual vault state storage**: Replaced with single pool

## Development Workflow

### To Test Locally

1. **Compile**: `clang --target=wasm32 -c src/peggy.c -o peggy.wasm -I src/include`
2. **Setup**: Configure oracles and trustlines via scripts/
3. **Deploy**: Upload peggy.wasm to Hooks Builder with admin + oracle parameters
4. **Test Mint**: `admin-mint.js` with test amounts
5. **Test Burn**: `admin-burn.js` to validate redemption
6. **Monitor**: Check debug stream for transaction flow

### Common Development Tasks

**Add validation**: Modify hook.c before the pool state check (line ~95)
**Change collateral ratio**: Modify macros at top (lines 20-23)
**Add new script**: Follow pattern in scripts/admin-mint.js
**Debug**: Use TRACEXFL(), TRACEVAR() macros, read debug stream

## Security Considerations

### What's Secured by Smart Contract

✅ Collateral ratio enforcement (150%/120%)
✅ Pool state integrity (immutable via hash)
✅ Currency validation (only BRL emitted by hook)
✅ Amount preservation (no creation/destruction except via mint/burn)

### What Requires Off-Chain Trust

❌ Admin honesty (can lie about pool state to users)
❌ KYC/AML (admin responsibility, not in contract)
❌ PIX payment reliability (admin must pay users)
❌ Oracle accuracy (oracle accounts could lie about rate)

### Mitigation Strategies

- **Admin multi-sig**: Use multi-signature wallet for admin account
- **Oracle redundancy**: Have backup oracle accounts
- **Auditing**: Regularly publish pool state to public ledger
- **Regulatory compliance**: Follow BACEN guidelines for stablecoins

## Future Improvements

1. **Multi-admin**: Support multiple admins with weighted voting
2. **Decentralized oracle**: Replace single oracle with aggregated feed
3. **Emergency pause**: Allow admin to freeze mint/burn operations
4. **Fee mechanism**: Take small % on mint/burn for sustainability
5. **Burn triggers**: Allow collateral ratio to automatically increase fees
6. **Cross-chain**: Support bridging to other blockchains

## References

- [XRPL Hooks Documentation](https://xrpl-hooks.readme.io/)
- [Trustlines - XRPL Docs](https://xrpl.org/trust-lines-and-issuing.html)
- [Xahau Network](https://xahau.network/)
- [Original Peggy (Richard Holland)](https://github.com/XRPLF/xrpl-hooks-examples)
