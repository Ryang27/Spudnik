import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';
import { sendSimpleEmbeddedError, sendSimpleEmbeddedMessage } from '../../lib/helpers';

/**
 * Unshorten a url.
 *
 * @export
 * @class UnshortCommand
 * @extends {Command}
 */
export default class UnshortCommand extends Command {
	/**
	 * Creates an instance of UnshortCommand.
	 *
	 * @param {CommandoClient} client
	 * @memberof UnshortCommand
	 */
	constructor(client: CommandoClient) {
		super(client, {
			aliases: ['unshorten'],
			args: [
				{
					key: 'query',
					prompt: 'What link should I unshorten?\n',
					type: 'string'
				}
			],
			description: 'Unshorten a link.',
			details: stripIndents`
				syntax: \`!unshort <short link>\`
			`,
			examples: [
				'!unshort http://bit.ly/Wn2Xdz',
				'!unshorten http://bit.ly/Wn2Xdz'
			],
			group: 'misc',
			memberName: 'unshort',
			name: 'unshort',
			throttling: {
				duration: 3,
				usages: 2
			}
		});
	}

	/**
	 * Run the "unshorten" command.
	 *
	 * @param {CommandMessage} msg
	 * @param {{ query: string }} args
	 * @returns {(Promise<Message | Message[]>)}
	 * @memberof UnshortCommand
	 */
	public async run(msg: CommandMessage, args: { query: string }): Promise<Message | Message[]> {
		const response = await sendSimpleEmbeddedMessage(msg, 'Loading...');
		require('url-unshort')().expand(args.query)
			.then((url: string) => {
				if (url) {
					msg.delete();
					return sendSimpleEmbeddedMessage(msg, `Original url is: <${url}>`);
				}
				return sendSimpleEmbeddedError(msg, 'This url can\'t be expanded. Make sure the protocol exists (Http/Https) and try again.', 3000);
			})
			.catch((err: Error) => {
				msg.client.emit('warn', `Error in command misc:unshort: ${err}`);
				return sendSimpleEmbeddedError(msg, 'There was an error with the request. The url may not be valid. Try again?', 3000);
			});
		return response;
	}
}
