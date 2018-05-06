var rankModel = {
    id: "rank-form",
    controllerName: "Rank",
    title: "Ranks",
    fields: [
        {
            id: "Id",
            name: "Id",
            type: "hidden",
            value: "0"
        },
        {
            id: "name",
            name: "Name",
            label: "Name",
            type: "text",
            help: "The EY Rank",
            required: true
        },
        {
            id: "clientbillrate",
            name: "ClientBillRate",
            label: "Client Bill Rate",
            type: "number",
            required: true
        },
        {
            id: "billrate",
            name: "BillRate",
            label: "EY Bill Rate",
            type: "number",
            required: true
        },
        {
            id: "costrate",
            name: "CostRate",
            label: "Cost Rate",
            type: "number",
            required: true
        }
    ],
    commands: [{}]
};

var rankList = {
    id: "rank-list",
    columns: [
        { caption: "Id", name: "Id", visible: "false" },
        { caption: "Name", name: "Name", visible: "true" },
        { caption: "Bill Rate", name: "BillRate", visible: "true" },
        { caption: "Standard Bill Rate", name: "StandardBillRate", visible: "true" },
        { caption: "Cost Rate", name: "CostRate", visible: "true" }
    ],
    keyColumnName: "Id",
    controllerName: "Rank"

};