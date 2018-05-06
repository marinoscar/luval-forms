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
            id: "billrate",
            name: "BillRate",
            label: "Bill Rate",
            type: "number",
            required: true
        },
        {
            id: "standardbillrate",
            name: "StandardBillRate",
            label: "Standard Bill Rate",
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
    controllerName: "Rank"

};
var resourceModel = {
    id: "resource-form",
    controllerName: "Resource",
    title: "Resources",
    fields: [
        {
            id: "Id",
            name: "Id",
            type: "hidden",
            value: "0"
        },
        {
            id: "rankid",
            name: "RankId",
            label: "Rank",
            type: "select",
            selectServiceUrl: '/Resource/GetAllRanks',
            required: true
        },
        {
            id: "name",
            name: "Name",
            label: "Name",
            type: "text",
            required: true
        },
        {
            id: "lastname",
            name: "LastName",
            label: "Last Name",
            type: "text",
            required: true
        },
        {
            id: "startdate",
            name: "StartDate",
            label: "Start Date",
            type: "date",
            required: true
        },
        {
            id: "gpn",
            name: "GPN",
            label: "GPN",
            type: "text",
            required: true
        },
        {
            id: "email",
            name: "Email",
            label: "Email",
            type: "email",
            required: true
        }
    ]
};
var resourceList = {
    id: "resource-list",
    columns: [
        { caption: "Id", name: "Id", visible: "false" },
        { caption: "Name", name: "Name", visible: "true" },
        { caption: "Last Name", name: "LastName", visible: "true" },
        { caption: "Rank", name: "RankName", visible: "true" },
        { caption: "Email", name: "Email", visible: "true" }
    ],
    controllerName: "Resource"

};
var sectorModel = {
    id: "sector-form",
    controllerName: "Sector",
    title: "Sector",
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
            required: true
        },
        {
            id: "preferedsector",
            name: "PreferedSector",
            label: "Is Prefered Sector",
            type: "checkbox",
            required: true
        }
    ]
};
var sectorList = {
    id: "sector-list",
    columns: [
        { caption: "Id", name: "Id", visible: "false" },
        { caption: "Name", name: "Name", visible: "true" },
        { caption: "Prefered Sector", name: "PreferedSector", visible: "true" }
    ],
    controllerName: "Sector"

};

var pipelineModel = {
    id: "pipeline-form",
    controllerName: "Pipeline",
    title: "Pipeline",
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
            required: true
        }
    ]
};

var pipelineList = {
    id: "pipeline-list",
    columns: [
        { caption: "Id", name: "Id", visible: "false" },
        { caption: "Name", name: "Name", visible: "true" }
    ],
    controllerName: "Pipeline"

};