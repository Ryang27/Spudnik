import { Message } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';
import { getRandomInt, sendSimpleEmbeddedError, sendSimpleEmbeddedImage } from '../../lib/helpers';

// tslint:disable-next-line:no-var-requires
const { bacon }: { bacon: string[] } = require('../../extras/data');

/**
 * Post a random bacon gif.
 *
 * @export
 * @class BaconCommand
 * @extends {Command}
 */
export default class BaconCommand extends Command {
	/**
	 * Creates an instance of BaconCommand.
	 *
	 * @param {CommandoClient} client
	 * @memberof BaconCommand
	 */
	constructor(client: CommandoClient) {
		super(client, {
			description: 'Blesses you with a random bacon gif.',
			examples: ['!bacon'],
			group: 'random',
			memberName: 'bacon',
			name: 'bacon',
			throttling: {
				duration: 3,
				usages: 2
			}
		});
	}

	/**
	 * Run the "bacon" command.
	 *
	 * @param {CommandMessage} msg
	 * @returns {(Promise<Message | Message[]>)}
	 * @memberof BaconCommand
	 */
	public async run(msg: CommandMessage): Promise<Message | Message[]> {
		if (bacon) {
			return sendSimpleEmbeddedImage(msg, bacon[getRandomInt(0, bacon.length)]);
		} else {
			return sendSimpleEmbeddedError(msg, 'Error getting answer. Try again later?', 3000);
		}
	}
}
