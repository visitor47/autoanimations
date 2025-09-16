import { debug }            from "../constants/constants.js";
import { trafficCop }       from "../router/traffic-cop.js";
import AAHandler            from "../system-handlers/workflow-data.js";
import { getRequiredData }  from "./getRequiredData.js";

// SW25 System hooks provided to run animations
export function systemHooks() {
    Hooks.on("sw25.applyDamage", async (data) => {
        if (!data.item) { return; }
        const requiredData = await getRequiredData({
            item: data.item,
            actor: data.actor,
            workflow: data.roll,
            isFumble: data.roll.isFumble,
            isCritical: data.roll.isCritical,
            targets: [data.target],
        });
        runAnimation(requiredData);
    });
}

async function runAnimation(input) {
    const handler = await AAHandler.make(input)
    if (!handler?.item || !handler?.sourceToken) {
        debug("No Item or Source Token", handler)
        return;
    }
    trafficCop(handler);
}
