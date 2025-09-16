import { debug }            from "../constants/constants.js";
import { trafficCop }       from "../router/traffic-cop.js";
import AAHandler            from "../system-handlers/workflow-data.js";
import { getRequiredData }  from "./getRequiredData.js";

// SW25 System hooks provided to run animations
export const systemHooks = {
    systemHooks() {
        console.log("Automated Animations | SW25 System Support Loading");
        debug("SW25 System Hooks Active");
        Hooks.on("sw25.applyDamage", async (data) => {
            debug("SW25 applyDamage hook called with data:", data);
            if (!data.item) { 
                debug("SW25: No item data found");
                return; 
            }
            const requiredData = await getRequiredData({
                item: data.item,
                actor: data.actor,
                workflow: data.roll,
                isFumble: data.roll.isFumble,
                isCritical: data.roll.isCritical,
                targets: [data.target],
            });
            debug("SW25: Required data prepared:", requiredData);
            runAnimation(requiredData);
        });
    }
}

async function runAnimation(input) {
    const handler = await AAHandler.make(input)
    if (!handler?.item || !handler?.sourceToken) {
        debug("No Item or Source Token", handler)
        return;
    }
    trafficCop(handler);
}
