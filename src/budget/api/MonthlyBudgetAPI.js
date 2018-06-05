import BaseAPI from './../../utils/baseApi';


class MonthlyBudgetAPI extends BaseAPI {

    getMonthlyBudgets(params = {}) {
        params.perPage = params.perPage ? params.perPage : 10;
        params.page = params.page ? params.page : 1;

        return this.api.get(`/monthly_budgets?perPage=${params.perPage}&page=${params.page}`);
    }

    getMonthlyBudgetExpenses(monthlyBudgetId) {
        return this.api.get(`/monthly_budgets/${monthlyBudgetId}/expenses/`);
    }

    countMonthlyBudgets() {
        return this.api.get('/monthly_budgets/count/');
    }

    setMonthlyBudgetExpenses(monthlyBudgetId, expenses, deletedExpenes = []) {
        var body = {
            expenses: expenses,
            deletedExpenses: deletedExpenes
        };

        return this.api.put(`/monthly_budgets/${monthlyBudgetId}/expenses/`, body);
    }

    createMonthlyBudget(monthlyBudget) {
        return this.api.post('/monthly_budgets/', monthlyBudget);
    }

    updateMonthlyBudget(monthlyBudget) {
        return this.api.put(`/monthly_budgets/${monthlyBudget.id}/`, monthlyBudget);
    }

    deleteMonthlyBudget(monthlyBudgetId) {
        return this.api.delete(`/monthly_budgets/${monthlyBudgetId}/`);
    }

    restoreMonthlyBudget(monthlyBudgetId) {
        return this.api.put(`/monthly_budgets/${monthlyBudgetId}/restore/`);
    }

}


export default new MonthlyBudgetAPI();