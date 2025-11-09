import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomLogger {
  private logger = new Logger('Fountain');

  // Main operation logging with detailed steps
  logOperationStart(operationType: string, data: any) {
    console.log('\n');
    this.logger.log('╔════════════════════════════════════════════════════════════════╗');
    this.logger.log(`║ ▶️  STARTING ${operationType.toUpperCase()} OPERATION`);
    this.logger.log('╚════════════════════════════════════════════════════════════════╝');
    this.logger.debug(`📋 Input Data: ${JSON.stringify(data, null, 2)}`);
  }

  logStep(stepNumber: number, stepName: string, details?: any) {
    const icon = '⚙️ ';
    const step = `[${stepNumber}] ${stepName}`;
    this.logger.log(`${icon} ${step}`);
    if (details) {
      this.logger.debug(`   └─ ${JSON.stringify(details)}`);
    }
  }

  logValidation(validationName: string, result: boolean, details?: any) {
    const icon = result ? '✅' : '❌';
    this.logger.log(`${icon} ${validationName}: ${result ? 'PASSED' : 'FAILED'}`);
    if (details) {
      this.logger.debug(`   └─ ${JSON.stringify(details)}`);
    }
  }

  logDataCreated(entityType: string, id: string, data: any) {
    this.logger.log(`✨ ${entityType} CREATED - ID: ${id}`);
    this.logger.debug(`   └─ Data: ${JSON.stringify(data, null, 2)}`);
  }

  logStateUpdate(entity: string, id: string, oldState: any, newState: any) {
    this.logger.log(`🔄 ${entity} STATE UPDATED - ID: ${id}`);
    this.logger.debug(`   └─ Old: ${JSON.stringify(oldState)}`);
    this.logger.debug(`   └─ New: ${JSON.stringify(newState)}`);
  }

  logOperationSuccess(operationType: string, result: any) {
    this.logger.log('╔════════════════════════════════════════════════════════════════╗');
    this.logger.log(`║ ✅ ${operationType.toUpperCase()} OPERATION SUCCESS`);
    this.logger.log('╚════════════════════════════════════════════════════════════════╝');
    this.logger.debug(`📊 Result: ${JSON.stringify(result, null, 2)}`);
    console.log('\n');
  }

  logOperationError(operationType: string, error: any) {
    this.logger.error('╔════════════════════════════════════════════════════════════════╗');
    this.logger.error(`║ ❌ ${operationType.toUpperCase()} OPERATION FAILED`);
    this.logger.error('╚════════════════════════════════════════════════════════════════╝');
    this.logger.error(`🚨 Error: ${error.message}`);
    if (error.stack) {
      this.logger.debug(`Stack: ${error.stack}`);
    }
    console.log('\n');
  }

  logCalculation(calculationName: string, inputs: any, output: any) {
    this.logger.log(`🧮 ${calculationName}`);
    this.logger.debug(`   ├─ Inputs: ${JSON.stringify(inputs)}`);
    this.logger.debug(`   └─ Output: ${JSON.stringify(output)}`);
  }

  logBlockchainTransaction(txHash: string, data: any) {
    this.logger.log(`⛓️  BLOCKCHAIN TRANSACTION`);
    this.logger.log(`   ├─ TxHash: ${txHash}`);
    this.logger.debug(`   └─ Data: ${JSON.stringify(data)}`);
  }

  logWebhookDelivery(webhookUrl: string, eventType: string, success: boolean, attempt: number) {
    const icon = success ? '🔔' : '📡';
    const status = success ? 'DELIVERED' : `ATTEMPT ${attempt} FAILED`;
    this.logger.log(`${icon} WEBHOOK DELIVERY - ${status}`);
    this.logger.debug(`   ├─ URL: ${webhookUrl}`);
    this.logger.debug(`   └─ Event: ${eventType}`);
  }

  logDatabaseQuery(query: string, parameters?: any) {
    this.logger.debug(`🗄️  DB QUERY: ${query}`);
    if (parameters) {
      this.logger.debug(`   └─ Params: ${JSON.stringify(parameters)}`);
    }
  }

  logInfo(message: string, data?: any) {
    this.logger.log(`ℹ️  ${message}`);
    if (data) {
      this.logger.debug(`   └─ ${JSON.stringify(data)}`);
    }
  }

  logWarning(message: string, data?: any) {
    this.logger.warn(`⚠️  ${message}`);
    if (data) {
      this.logger.debug(`   └─ ${JSON.stringify(data)}`);
    }
  }

  logError(message: string, error?: any) {
    this.logger.error(`🚨 ${message}`);
    if (error) {
      this.logger.error(`   └─ ${error.message || JSON.stringify(error)}`);
    }
  }
}
