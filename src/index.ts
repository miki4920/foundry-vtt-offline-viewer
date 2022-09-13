import Tagify from '@yaireo/tagify'

Hooks.on("init", async function() {
    await game["settings"].registerMenu("foundry-vtt-offline-viewer", "foundry-vtt-offline-viewer-settings", {
        name: "Wealth Settings",
        label: "Open Me!",
        hint: "This dialogue would allow you to insert players and treasury using Tagify.",
        icon: "fas fa-bars",
        type: TagifyInputs,
        restricted: true
    });

    await game["settings"].register("foundry-vtt-offline-viewer", "wealthIDs", {
        scope: 'world',
        config: false,
        type: Object,
        default: {
            "priorityIDs": [],
            "IDs": []
        },
    });
});

Hooks.on("updateItem", async function (equipment, system, diff, user) {
    if (user != game["user"].id) { return;}
    let players = game["settings"].get("foundry-vtt-offline-viewer", "wealthIDs")["IDs"]
    for(const player of players) {
        console.log(game["actors"].get(player))
    }
})

class TagifyInputs extends FormApplication {
    override activateListeners(): void {
        const priorityInput = document.querySelector(`input[name="priorityWealthInput"]`)
        const regularInput = document.querySelector(`input[name="wealthInput"]`)
        new Tagify(priorityInput)
        new Tagify(regularInput)
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["form"],
            popOut: true,
            template: `modules/foundry-vtt-offline-viewer/dist/forms/wealthForm.html`,
            id: "wealthForm",
            title: "Wealth Form",
            height: 255,
            width: 840,
        });

    }

    protected _updateObject(event: Event, formData?: object): Promise<unknown> {
        let IDs: { priorityIDs: String[]; IDs: String[] };
        IDs = {"priorityIDs": [], "IDs": []};
        if (formData) {
            if (formData["priorityWealthInput"] !== "") {
                for (const element of JSON.parse(formData["priorityWealthInput"])) {
                    IDs["priorityIDs"].push(element["value"])
                }
            }
            if(formData["wealthInput"] !== "") {
                for (const element of JSON.parse(formData["wealthInput"])) {
                    IDs["IDs"].push(element["value"])
                }
            }
        }
        return game["settings"].set("foundry-vtt-offline-viewer", "wealthIDs", IDs)
    }

    // @ts-ignore
    getData() {
        const wealthIDs = game["settings"].get("foundry-vtt-offline-viewer", "wealthIDs");
        let priorityIDs = wealthIDs["priorityIDs"].join()
        let IDs = wealthIDs["IDs"].join()
        return {"IDs": IDs, "priorityIDs": priorityIDs}
    }


}
