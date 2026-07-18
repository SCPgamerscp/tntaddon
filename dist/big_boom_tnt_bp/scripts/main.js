import { system } from "@minecraft/server";

function ignite(block, dimension) {
    dimension.playSound("fire.ignite", block.location);
    dimension.spawnEntity("bigboomtnt:primed_big_boom_tnt", {
        x: block.location.x + 0.5,
        y: block.location.y,
        z: block.location.z + 0.5
    });
    block.setType("minecraft:air");
}

const IgniteComponent = {
    onPlayerInteract(event) {
        const equipment = event.player.getComponent("equippable");
        const mainhand = equipment?.getEquipment("Mainhand");

        if (mainhand?.typeId === "minecraft:flint_and_steel") {
            ignite(event.block, event.dimension);
        }
    },

    onTick(event) {
        if ((event.block.getRedstonePower() ?? 0) > 0) {
            ignite(event.block, event.dimension);
        }
    }
};

system.beforeEvents.startup.subscribe((e) => {
    e.blockComponentRegistry.registerCustomComponent("bigboomtnt:ignite_component", IgniteComponent);
});
