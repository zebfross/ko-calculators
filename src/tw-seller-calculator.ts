/// <reference path="../node_modules/@types/knockout/index.d.ts" />

declare var ko: KnockoutStatic;

class TradelineModel {
    app: AppViewModel;
    type: KnockoutObservable<string>;
    limit: KnockoutObservable<number>;
    age: KnockoutObservable<number>;
    spots: KnockoutObservable<number>;
    perfectPaymentHistory: KnockoutObservable<boolean>;

    displayLimit: KnockoutComputed<string>;

    displayAge: KnockoutComputed<string>;
    maxSpots: KnockoutComputed<number>;

    incomeForRate(this: TradelineModel, rate: number) {
        if (!this.perfectPaymentHistory() || this.limit() < 3000)
            return 0;
        return (Math.max(275, (this.limit() * 0.015 + this.age() * 25)) * rate) * this.spots();
    }

    comments: KnockoutComputed<string>;

    income: KnockoutComputed<number>;

    constructor(app=null, type="", limit=5000, age=5, perfectPaymentHistory=true) {
        this.app = app;
        this.type = ko.observable(type);
        this.limit = ko.observable(limit);
        this.age = ko.observable(age);
        this.spots = ko.observable(this.app.maxSpotsForCardType(type));
        this.type.subscribe(() => {
            let max = this.app.maxSpotsForCardType(this.type());
            if (max < this.spots())
                this.spots(max);
        })
        this.perfectPaymentHistory = ko.observable<boolean>(perfectPaymentHistory);

        this.displayLimit = ko.computed(() => {
            // @ts-ignore
            return "$" + Math.round(this.limit()).toLocaleString();
        });

        this.displayAge = ko.computed(() => {
            return this.age() + " years";
        });

        this.maxSpots = ko.computed(() => {
            return this.app.maxSpotsForCardType(this.type());
        })

        this.income = ko.computed(() => {
            return this.incomeForRate(0.4);
        });

        this.comments = ko.computed(() => {
            if (!this.perfectPaymentHistory())
                return "We only accept cards with perfect payment history.";

            if (this.limit() < 3000)
                return "We only accept cards with a limit of $3000 or more.";

            return "";
        });
    }
}

class AppViewModel {
    tradelines = ko.observableArray([]);

    addTradeline = function (this: AppViewModel) {
        this.tradelines.push(new TradelineModel(this));
    };
    removeTradeline: () => void;

    incomeForRate(this: AppViewModel, rate: number) {
        // @ts-ignore
        let income = this.tradelines().reduce(function (acc: number, tradeline: TradelineModel) {
            return acc + tradeline.incomeForRate(rate);
        }, 0)
            .toLocaleString()
        return (
            "$" + income
        );
    }

    income: KnockoutComputed<string>;

    cardTypes = {
        "Chase": 2,
        "Discover": 1,
        "Capital One": 2,
        "US Bank": 2,
        "Bank of America": 2
    }

    cardNames = Object.keys(this.cardTypes);

    maxSpotsForCardType(type: string) {
        let max = this.cardTypes[type];
        if (max === undefined) {
            return 1;
        }
        return max;
    }

    buttonText: KnockoutComputed<string> = ko.computed(() => {
        if (this.tradelines().length === 0) {
            return "Add a Tradeline";
        }
        return "Add Another Tradeline";
    });

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
