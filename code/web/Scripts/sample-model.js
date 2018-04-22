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
        }
    ]
}