import { debug }            from "../constants/constants.js";
import { trafficCop }       from "../router/traffic-cop.js";
import AAHandler            from "../system-handlers/workflow-data.js";
import { getRequiredData }  from "./getRequiredData.js";

// SW25 System hooks provided to run animations
export function systemHooks() {
    console.log("Automated Animations | SW25 System Support Loading");
    debug("SW25 System Hooks Active");
    Hooks.on("sw25.applyDamage", async (object) => {
            console.log("SW25 | applyDamage hook received data:", {
                hasItem: !!object.item,
                itemType: object.item?.type,
                itemId: object.item?.id,
                hasActor: !!object.actor,
                actorId: object.actor?.id,
                rollData: object.roll,
                targetId: object.target?.id,
                objectName: object.item?.item?.name,
            });

        

            console.log("SW25 | Preparing animation data for:", object.item?.name);
            const requiredData = await getRequiredData({
                item: object.item,
                name: object.item?.item?.name,
                actor: object.actor,
                workflow: object.roll,
                isFumble: object.roll?.isFumble,
                isCritical: object.roll?.isCritical,
                targets: [object.target],
            });
            
            console.log("SW25 | Animation data prepared:", {
                hasToken: !!requiredData.token,
                hasTargets: !!requiredData.targets?.length,
                animationType: requiredData.animation
            });
            
            runAnimation(object);
        });
    }

async function runAnimation(input) {
    console.log("SW25 | Running animation with data:", input);
    if(!input.item) {
        console.log("SW25 | No item data found, aborting animation.");
    }

    const handler = await AAHandler.make(input)
    if (!handler?.item || !handler?.sourceToken) {
        debug("No Item or Source Token", handler)
        return;
    }
    trafficCop(handler);
}
