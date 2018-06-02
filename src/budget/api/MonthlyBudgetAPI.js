import BaseAPI from './../../utils/baseApi';


class MonthlyBudgetAPI extends BaseAPI {

    getMonthlyBudgets() {
        return this.api.get('/monthly_budgets/');
    }

    getMonthlyBudgetExpenses(monthlyBudgetId) {
        return this.api.get(`/monthly_budgets/${monthlyBudgetId}/expenses/`);
    }

    setMonthlyBudgetExpenses(monthlyBudgetId, expenses) {
        return this.api.put(`/monthly_budgets/${monthlyBudgetId}/expenses/`, expenses);
    }

}


export default new MonthlyBudgetAPI();