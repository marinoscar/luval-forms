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
            id: "standardrank",
            name: "StandardRank",
            label: "Standard Rank",
            type: "select",
            items: [
                { text: 'Staff', value: 'Staff' },
                { text: 'Senior', value: 'Senior' },
                { text: 'Manager', value: 'Manager' },
                { text: 'Senior Manager', value: 'Senior Manager' },
                { text: 'Executive Director', value: 'Executive Director' },
                { text: 'Partner', value: 'Partner' }
            ],
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
        { caption: "Standard Rank", name: "StandardRank", visible: "true" },
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
        },
        {
            fields: [
                {
                    id: "clientid",
                    name: "ClientId",
                    label: "Client",
                    type: "select",
                    selectServiceUrl: '/Pipeline/GetAllClient',
                    required: true
                },
                {
                    id: "subservicelineid",
                    name: "SubServiceLineId",
                    label: "Sub Service Line",
                    type: "select",
                    selectServiceUrl: '/Pipeline/GetAllSubServiceLine',
                    required: true
                },
                {
                    id: "offeringid",
                    name: "OfferingId",
                    label: "Offering",
                    type: "select",
                    selectServiceUrl: '/Pipeline/GetAllOffering',
                    required: true
                }
            ]
        },
        {
            fields: [
                {
                    id: "pursueleaderid",
                    name: "PursueLeaderId",
                    label: "Pursue Leader",
                    type: "select",
                    selectServiceUrl: '/Pipeline/GetAllResource',
                    required: false
                },
                {
                    id: "managerid",
                    name: "ManagerId",
                    label: "Manager",
                    type: "select",
                    selectServiceUrl: '/Pipeline/GetAllResource',
                    required: false
                },
                {
                    id: "interactioncode",
                    name: "InteractionCode",
                    label: "Interaction Code",
                    type: "text",
                    selectServiceUrl: '/Pipeline/GetSubServiceLine',
                    required: false
                }
            ]
        },
        {
            fields: [
                {
                    id: "useleader",
                    name: "USLeader",
                    label: "Project Leader",
                    type: "text",
                    help: "Name of the project leader in the account",
                    required: false
                },
                {
                    id: "usmanager",
                    name: "USManager",
                    label: "Project Manager",
                    type: "text",
                    help: "Name of the manager in the account",
                    required: false
                },
                {
                    id: "referredby",
                    name: "ReferredBy",
                    label: "Referred By",
                    type: "text",
                    help: "Person who referred the work",
                    required: false
                }
            ]
        },
        {
            fields: [
                {
                    id: "winprobability",
                    name: "WinProbability",
                    label: "Win Probability (%)",
                    type: "number",
                    help: "% of probability to win the work",
                    required: false
                },
                {
                    id: "status",
                    name: "Status",
                    label: "Status",
                    type: "select",
                    help: "Status of the opportunity",
                    items: [
                        { value: 0, text: "None" },
                        { value: 1, text: "Identify" },
                        { value: 2, text: "Pursue" },
                        { value: 3, text: "Closing" },
                        { value: 4, text: "Won" },
                        { value: 5, text: "Lost" },
                        { value: 6, text: "On Hold" },
                        { value: 7, text: "Canceled" }
                    ],
                    required: false
                },
                {
                    id: "priority",
                    name: "Priority",
                    label: "Priority",
                    type: "select",
                    items: [
                        { value: 0, text: "None" },
                        { value: 1, text: "Low" },
                        { value: 2, text: "Mid" },
                        { value: 3, text: "High" }
                    ],
                    help: "The priority for the opportunity",
                    required: false
                }
            ]
        },
        {
            fields: [
                {
                    id: "ApprovalDate",
                    name: "ApprovalDate",
                    label: "Approval Date",
                    type: "date",
                    help: "Potential decision date",
                    required: false
                },
                {
                    id: "StartDate",
                    name: "StartDate",
                    label: "Start Date",
                    type: "date",
                    help: "Potential start date",
                    required: false
                },
                {
                    id: "FinishDate",
                    name: "FinishDate",
                    label: "Finish Date",
                    type: "date",
                    help: "Potential end date",
                    required: false
                }
            ]
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

var pipeResourceList = {
    id: "piperesource-table",
    columns: [
        { id: "rankName", name: "RankName", caption: "Rank", visible: "true" },
        { id: "hourlyrate", name: "HourlyRate", caption: "Hourly Rate", visible: "true" },
        { id: "hours", name: "Hours", caption: "Hours", visible: "true" },
    ]
}

var pipeResourceModalModel = {
    id: "pipeline-resource-model-form",
    title: "Pipeline Resource",
    fields: [
        { id: "id", name: "Id", type: "hidden", label: "id" },
        { id: "pipelineid", name: "PipelineId", type: "hidden", label: "pipe" },
        { id: "rankid", name: "RankId", type: "select", label: "Rank", selectServiceUrl: '/Pipeline/GetAllRanks', required: true },
        {
            fields: [
                { id: "hourlyrate", name: "HourlyRate", type: "number", label: "Bill Rate" },
                { id: "hours", name: "Hours", type: "number", label: "Hours" }
            ]
        }
    ]
};