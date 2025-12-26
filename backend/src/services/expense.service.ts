import { Injectable } from '@nestjs/common';

@Injectable()
export class ExpenseService {
  async createExpense(data: any): Promise<any> {
    // Create expense in draft status
    return { id: 'exp_' + Date.now(), status: 'draft', ...data };
  }

  async confirmExpense(expenseId: string): Promise<any> {
    // Move expense from draft to confirmed
    // Trigger ledger entry creation
    return { id: expenseId, status: 'confirmed' };
  }

  async reverseExpense(expenseId: string): Promise<any> {
    // Create reversal ledger entries (mirror original)
    return { id: expenseId, status: 'reversed' };
  }

  async getExpense(expenseId: string): Promise<any> {
    // Fetch expense details with full history
    return { id: expenseId };
  }
}
