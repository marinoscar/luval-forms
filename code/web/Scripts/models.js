var rankModel = {
    id: "rank-form",
    method: "post",
    action: "/",
    title: "Ranks",
    fields: [
        {
            id: "Id",
            name: "Id",
            type: "hidden",
            value: "0",
        },
        {
            id: "rank",
            name: "Rank",
            label: "Rank",
            type: "text",
            help: "The EY Rank",
            attributes: [{ "required": "" }],
        },
        {
            id: "clientbillrate",
            name: "ClientBillRate",
            label: "Client Bill Rate",
            type: "number",
            attributes: [{ "required": "" }],
        },
        {
            id: "billrate",
            name: "BillRate",
            label: "EY Bill Rate",
            type: "number",
            attributes: [{ "required": "" }],
        },
        {
            id: "costrate",
            name: "CostRate",
            label: "Cost Rate",
            type: "number",
            attributes: [{ "required": "" }],
        },
    ],
    commands: [{}]
}