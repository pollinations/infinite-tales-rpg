import {stringifyPretty} from "$lib/util.svelte.ts";
import {GeminiProvider} from "../llmProvider";

export const storyStateForPrompt = {
    game: "Any Pen & Paper System e.g. Pathfinder, Call of Cthulhu, Star Wars, Fate Core, World of Darkness, GURPS, Mutants & Masterminds, Dungeons & Dragons",
    adventure_and_main_event: "Generate a random adventure with a random main story line. It does not have to be a quest, it can also be an event. It should be extraordinary and not cliche.",
    character_simple_description: "Generate a random character fitting the GAME system in ADVENTURE_AND_MAIN_EVENT, only provide a simple description and not every detail",
    general_image_prompt: "Create a general system prompt max 10 words for this adventure to add to every image that is generated by an ai. Format: {visualStyle} {genre} {artistReference}",
    theme: "THEME of the story telling, e.g. world the story is located in",
    tonality: "TONALITY of the story telling, writing style, must fit GAME system",
};

export class StoryAgent {

    llmProvider: GeminiProvider;

    constructor(llmProvider: GeminiProvider) {
        this.llmProvider = llmProvider;
    }


    async generateRandomStorySettings(overwrites = undefined, characterDescription = undefined) {
        let storyAgent = "You are RPG story agent, crafting captivating, limitless GAME experiences using BOOKS, THEME, TONALITY for CHARACTER.\n" +
            "Always respond with following JSON!\n" +
            stringifyPretty(storyStateForPrompt);

        let preset = {
            ...storyStateForPrompt,
            ...overwrites,
        }
        const contents = [
            {
                "role": "user",
                "parts": [{"text": "Create a new randomized story considering the following settings: " + stringifyPretty(preset)}]
            }
        ];
        if(characterDescription){
            contents.push( {
                "role": "user",
                "parts": [{"text": "Character description: " + stringifyPretty(characterDescription)}]
            })
        }
        const jsonParsed = await this.llmProvider.sendToAI(
            contents,
            {parts: [{"text": storyAgent}]}
        );
        return jsonParsed;
    }

}
