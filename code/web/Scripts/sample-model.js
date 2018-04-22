var simpleForm = {
    id: "client-form",
    method: "post",
    action:"/",
    title: "Client",
    fields: [
        {
            row: 1,
            id: "code",
            name: "Code",
            label: "Code",
            placeholder: "Enter code",
            type: "text",
            help: "The code identifies the client",
            attributes: [{ "required": "" }],
        },
        {
            row: 2,
            id: "name",
            name: "Name",
            label: "Name",
            placeholder: "Enter name",
            type: "text",
            help: "The name identifies the client",
            attributes: [{ "required": "" }],
        },
    ]
}