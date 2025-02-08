import { trafficCop }       from "../router/traffic-cop.js"
import AAHandler            from "../system-handlers/workflow-data.js";
import { getRequiredData }  from "./getRequiredData.js";

export function systemHooks() {
    Hooks.on("createChatMessage", async (msg) => {
    if (msg.author.id !== game.user.id) {
      return;
    }
    let compiledData = await getRequiredData({
      itemId: msg.system?.weaponId,
      actorId: msg.speaker?.actor,
      tokenId: msg.speaker?.token,
      workflow: msg
    });
    runDcc(compiledData);
  });
}

async function runDcc(input) {
  const handler = await AAHandler.make(input)
  trafficCop(handler);
}
