export const portfolioResponseWithOrdersMock = {
    "availableCash": 753000,
    "positions": [
        {
            "instrumentId": 47,
            "instrumentName": "Pampa Holding S.A.",
            "quantity": 40,
            "currentPrice": 925.85,
            "totalValue": 37034,
            "pnlPercent": -0.45
        },
        {
            "instrumentId": 31,
            "instrumentName": "Banco Macro S.A.",
            "quantity": -10,
            "currentPrice": 1502.80,
            "totalValue": -15028,
            "pnlPercent": -2.42
        },
        {
            "instrumentId": 54,
            "instrumentName": "MetroGAS S.A.",
            "quantity": 500,
            "currentPrice": 229.50,
            "totalValue": 114750,
            "pnlPercent": -8.2
        }
    ],
    "totalValue": 889756
}

export const portfolioResponseWithoutOrdersMock = {
    "availableCash": 0,
    "positions": [],
    "totalValue": 0
}
