# Setup Supabase para Fountain Backend

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha uma organização
4. Preencha:
   - **Project Name**: `fountain-dev`
   - **Password**: Copie em algum lugar seguro
   - **Region**: `sa-east-1` (São Paulo) ou outra próxima
5. Clique "Create new project" (leva alguns minutos)

## 2. Configurar .env

Após criar o projeto, vá para Settings > Database:

- **Host**: `xxxx.supabase.co`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: A senha que você criou

Atualize `.env`:

```bash
DB_HOST=xxxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=seu_password_aqui
DB_NAME=postgres
DB_SYNCHRONIZE=true
DB_LOGGING=true
```

## 3. Iniciar o Backend

```bash
cd backend

# Instalar dependências (se não fez ainda)
npm install

# Compilar
npm run build

# Rodar em desenvolvimento
npm run start:dev
```

## 4. Acessar Swagger

Abra o navegador em:

```
http://localhost:3000/docs
```

## 5. Testar Endpoints

Vá para a aba "Stablecoins" ou "Tokenizers" e teste:

- **GET /api/v1/tokenizers** - Listar tokenizers (deve estar vazio)
- **POST /api/v1/tokenizers** - Criar tokenizer

Body para POST:

```json
{
  "name": "ABToken",
  "email": "contato@abtoken.com",
  "subscriptionTier": "pro"
}
```

## 6. Verificar Banco

Na console do Supabase, vá para SQL Editor e rode:

```sql
SELECT * FROM public.tokenizers;
SELECT * FROM public.stablecoins;
SELECT * FROM public.oracle;
SELECT * FROM public.webhook_events;
```

---

**Pronto!** O backend agora está sincronizando a estrutura com o banco de dados.

### Próximos Passos

- [ ] Implementar operações (deposit/withdraw)
- [ ] Mock services para PIX e RLUSD
- [ ] Cronjobs para taxas USD/BRL
- [ ] SDK TypeScript
- [ ] Deploy para staging
