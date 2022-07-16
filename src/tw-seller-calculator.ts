/// <reference path="../node_modules/@types/knockout/index.d.ts" />

declare var ko: KnockoutStatic;

class TradelineModel {
    type: KnockoutObservable<string>;
    limit: KnockoutObservable<number>;
    age: KnockoutObservable<number>;
    perfectPaymentHistory: KnockoutObservable<boolean>;

    displayLimit: KnockoutComputed<string>;

    displayAge: KnockoutComputed<string>;

    incomeForRate(this: TradelineModel, rate: number) {
        return (this.limit() * 0.015 + this.age() * 25) * rate;
    }

    constructor() {
        this.type = ko.observable("Chase");
        this.limit = ko.observable(2000);
        this.age = ko.observable(2);
        this.perfectPaymentHistory = ko.observable<boolean>(false);

        this.displayLimit = ko.computed(() => {
            // @ts-ignore
            return "$" + Math.round(this.limit()).toLocaleString();
        });

        this.displayAge = ko.computed(() => {
            return this.age() + " years";
        });
    }
}

class AppViewModel {
    tradelines = ko.observableArray([new TradelineModel()]);

    addTradeline = function (this: AppViewModel) {
        this.tradelines.push(new TradelineModel());
    };
    removeTradeline: () => void;

    incomeForRate(this: AppViewModel, rate: number) {
        // @ts-ignore
        let income = this.tradelines().reduce(function (acc: number, tradeline: TradelineModel) {
            return acc + tradeline.incomeForRate(rate) + 1;
        }, 0)
            .toLocaleString()
        return (
            "$" + income
        );
    }

    income: KnockoutComputed<string>;

    constructor() {
        var _this = this;
        this.income = ko.computed(() => {
            return this.incomeForRate(0.4);
        });

        this.removeTradeline = function (this: TradelineModel) {
            _this.tradelines.remove(this);
        };
    }
}

ko.applyBindings(
    new AppViewModel(),
    document.getElementById("ko-calculator-tw-seller")
);
