import { system } from "@minecraft/server";

const IgniteComponent = {
    onPlayerInteract(e) {
        const player = e.player;
        const block = e.block;
        const dimension = e.dimension;
        
        const equipment = player.getComponent("equippable");
        if (equipment) {
            const mainhand = equipment.getEquipment("Mainhand");
            if (mainhand && mainhand.typeId === "minecraft:flint_and_steel") {
                // Play ignition sound
                dimension.playSound("fire.ignite", block.location);
                
                // Spawn primed TNT entity
                dimension.spawnEntity("bigboomtnt:primed_big_boom_tnt", {
                    x: block.location.x + 0.5,
                    y: block.location.y,
                    z: block.location.z + 0.5
                });
                
                // Set the block to air
                block.setType("minecraft:air");
            }
        }
    }
};

system.beforeEvents.startup.subscribe((e) => {
    e.blockComponentRegistry.registerCustomComponent("bigboomtnt:ignite_component", IgniteComponent);
});
