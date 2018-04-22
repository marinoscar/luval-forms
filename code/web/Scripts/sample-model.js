var simpleForm = {
    id: "client-form",
    method: "post",
    action: "/",
    title: "Client",
    fields: [
        {
            row: 1,
            id: "id",
            name: "Id",
            type: "hidden",
        },
        {
            row: 1,
            id: "code",
            name: "Code",
            label: "Code",
            placeholder: "Enter code",
            type: "text",
            attributes: [{ "required": "true" }],
        },
        {
            row: 2,
            id: "name",
            name: "Name",
            label: "Name",
            type: "text",
            help: "The name identifies the client",
            attributes: [{ "required": "" }],
        },
        {
            row: 2,
            id: "company",
            name: "Company",
            label: "Company",
            type: "select",
            help: "The name identifies the company",
            attributes: [{ "required": "" }],
            value: "2",
            items: [{ text: "EY", value: "1" }, { text: "Exxon", value: "2" }, { text: "Monsanto", value: "3" }]
        },
        {
            row: 2,
            id: "description",
            name: "Description",
            label: "Description",
            type: "textarea",
            rows: 4
        },
        {
            row: 2,
            id: "datecontrol",
            name: "Date",
            label: "Date",
            type: "Date",
        }
    ],
    commands: [
        {
            id: "save",
            text: "Save",
            type: "submit",
            classType: "primary",
            formAction: "/action",
            formMethod: "post"
        }
    ],
}

var simpleList = {
    id: "client-list",
    columns: [
        { caption: "Id", name: "Id", visible: "false" },
        { caption: "Code", name: "Code", visible: "true" },
        { caption: "Name", name: "Name", visible: "true" },
        { caption: "Date", name: "Date", visible: "true" },
    ],
    keyColumnName: "Id",
    commands: [
        { text: "Update", classType: "primary" },
        { text: "Delete", classType: "secundary" },
    ]

}

var simpleData = [
    { Id: 1, Code: "MYM-001", Name: "Oscar Marin", Description: "None", Date: "1983-01-19" },
    { Id: 2, Code: "MYM-002",  Name: "Pamela Molina", Description: "None", Date: "1983-01-19" },
    { Id: 3, Code: "MYM-003",  Name: "Lucia Marin", Description: "None", Date: "1983-01-19" },
    { Id: 4, Code: "MYM-004",  Name: "Valeria Marin", Description: "None", Date: "1983-01-19" },
]