
export default function() {
  /**
   * Create a macro when dropping an entity on the hotbar
   * Item      - open roll dialog for item
   * Actor     - open actor sheet
   * Journal   - open journal sheet
   */
  Hooks.on("hotbarDrop", async (bar, data, slot) => {
    // Create item macro if rollable item - weapon, spell, prayer, trait, or skill
    if (data.type == "Item") {
      if (system.type != "weapon" && system.type != "spell" && system.type != "prayer" && system.type != "trait" && system.type != "skill")
        return
      let item = system
      let command = `game.wfrp4e.utility.rollItemMacro("${item.name}", "${item.type}");`;
      let macro = game.macros.contents.find(m => (m.name === item.name) && (m.command === command));
      if (!macro) {
        macro = await Macro.create({
          name: item.name,
          type: "script",
          img: item.img,
          command: command
        }, { displaySheet: false })
      }
      game.user.assignHotbarMacro(macro, slot);
    }
    // Create a macro to open the actor sheet of the actor dropped on the hotbar
    else if (data.type == "Actor") {
      let actor = game.actors.get(data.id);
      let command = `game.actors.get("${data.id}").sheet.render(true)`
      let macro = game.macros.contents.find(m => (m.name === actor.name) && (m.command === command));
      if (!macro) {
        macro = await Macro.create({
          name: actor.name,
          type: "script",
          img: actor.img,
          command: command
        }, { displaySheet: false })
        game.user.assignHotbarMacro(macro, slot);
      }
    }
    // Create a macro to open the journal sheet of the journal dropped on the hotbar
    else if (data.type == "JournalEntry") {
      let journal = game.journal.get(data.id);
      let command = `game.journal.get("${data.id}").sheet.render(true)`
      let macro = game.macros.contents.find(m => (m.name === journal.name) && (m.command === command));
      if (!macro) {
        macro = await Macro.create({
          name: journal.name,
          type: "script",
          img: "systems/wfrp4e/icons/buildings/scroll.png",
          command: command
        }, { displaySheet: false })
        game.user.assignHotbarMacro(macro, slot);
      }
    }
    return false;
  });
}
