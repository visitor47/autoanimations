import { debug }            from "../constants/constants.js";
import { trafficCop }       from "../router/traffic-cop.js";
import AAHandler            from "../system-handlers/workflow-data.js";
import { getRequiredData }  from "./getRequiredData.js";

// SW25 System hooks provided to run animations
export function systemHooks() {
    console.log("Automated Animations | SW25 System Support Loading");
    debug("SW25 System Hooks Active");
    Hooks.on("sw25.applyDamage", async (data) => {
            // console.log("SW25 | applyDamage hook received data:", {
            //     hasItem: !!data.item,
            //     itemType: data.item?.type,
            //     itemId: data.item?.id,
            //     hasActor: !!data.actor,
            //     actorId: data.actor?.id,
            //     rollData: data.roll,
            //     targetId: data.target?.id
            // });

            // if (!data.item) { 
            //     console.warn("SW25 | Missing item data in hook call");
            //     return; 
            // }
            // if (!data.actor) {
            //     console.warn("SW25 | Missing actor data in hook call");
            //     return;
            // }
            // if (!data.target) {
            //     console.warn("SW25 | Missing target data in hook call");
            //     return;
            // }

            console.log("SW25 | Preparing animation data for:", data.item.name);
            const requiredData = await getRequiredData({
                item: data.item,
                actor: data.actor,
                workflow: data.roll,
                isFumble: data.roll?.isFumble,
                isCritical: data.roll?.isCritical,
                targets: [data.target],
            });
            
            console.log("SW25 | Animation data prepared:", {
                hasToken: !!requiredData.token,
                hasTargets: !!requiredData.targets?.length,
                animationType: requiredData.animation
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
