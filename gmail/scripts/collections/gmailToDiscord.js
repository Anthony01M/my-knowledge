/**
 * Gmail to Discord
 * @requires Discord
 * @configuration DISCORD_WEBHOOK_URL, RATE_LIMIT_DELAY, SENSITIVE_KEYWORDS
*/

const DISCORD_WEBHOOK_URL = 'REPLACE_ME',
	ATTACHMENT_SIZE_LIMIT = 8 * 1024 * 1024,
	RATE_LIMIT_DELAY = 20000,
	LAST_CHECK_KEY = 'LAST_EMAIL_CHECK',
	RATE_LIMIT_KEY = 'RATE_LIMIT_TIMES',
	SENSITIVE_KEYWORDS = ['password reset', 'otp', 'one-time password', 'verification code', 'security alert', 'login attempt'],
	IP_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g

function redactIPs(text) {
	return text.replace(IP_REGEX, '[REDACTED]')
}

function htmlToText(html) {
	return html
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/<style[\s\S]*?<\/style>/gi, '')
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/p>/gi, '\n\n')
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\n{3,}/g, '\n\n')
		.trim()
}

let rateLimitQueue = JSON.parse(PropertiesService.getScriptProperties().getProperty(RATE_LIMIT_KEY)) || []

function createTrigger() {
	ScriptApp.newTrigger('checkForNewEmails')
		.timeBased()
		.everyMinutes(5)
		.create()
}

function checkForNewEmails() {
	const lastCheck = PropertiesService.getScriptProperties().getProperty(LAST_CHECK_KEY)
	let baseQuery = 'is:inbox is:unread'
	if (lastCheck) {
		const timestampSec = Math.floor(Number(lastCheck) / 1000)
		baseQuery += ` after:${timestampSec}`
	}
	let threads
	for (let attempt = 0; attempt < 3; attempt++) {
		try {
			threads = GmailApp.search(baseQuery)
			break
		} catch (e) {
			if (attempt === 2) throw e
			Utilities.sleep(2000)
		}
	}
	threads.reverse().forEach(thread => {
		thread.getMessages().forEach(message => {
			processEmail(message)
			message.markRead()
		})
	})
	PropertiesService.getScriptProperties().setProperty(LAST_CHECK_KEY, Date.now().toString())
}

function processNewEmail(e) {
	try {
		if (e && e.gmail && e.gmail.messageId) {
			const message = GmailApp.getMessageById(e.gmail.messageId)
			processEmail(message)
			return
		}
		if (typeof e === 'undefined') {
			const messages = GmailApp.getInboxThreads(0, 1)[0]?.getMessages()
			if (messages) processEmail(messages.pop())
			return
		}
		console.error('Unsupported trigger type:', JSON.stringify(e))
	} catch (error) {
		console.error('Error:', error)
	}
}

function processEmail(message) {
	try {
		if (!message) return
		const originalBody = extractEmailBody(message),
			originalSubject = message.getSubject(),
			redactedBody = redactIPs(originalBody),
			redactedSubject = redactIPs(originalSubject),
			content = `${originalSubject} ${originalBody}`.toLowerCase(),
			ips = extractIPs(content),
			isSensitive = SENSITIVE_KEYWORDS.some(kw => content.includes(kw)) || ips.length > 0
		if (isSensitive) {
			handleSensitiveEmail(message, ips)
			return
		}
		const emailData = {
			from: message.getFrom(),
			subject: redactedSubject,
			body: redactedBody.substring(0, 1600),
			attachments: processAttachments(message.getAttachments()),
			date: message.getDate().toISOString(),
			messageId: message.getId()
		}
		sendToDiscord(formatDiscordMessage(emailData))
	} catch (error) {
		console.error('Error processing email:', error)
	}
}

function extractEmailBody(message) {
	let text = message.getPlainBody()
	if (!text.trim()) text = htmlToText(message.getBody())
	return text.replace(/\s{2,}/g, ' ').trim()
}

function extractIPs(content) {
	const matches = content.match(IP_REGEX) || []
	return [...new Set(matches)]
}

function processAttachments(attachments) {
	return attachments.map(attachment => {
		return {
			name: attachment.getName(),
			data: attachment.getBytes().length > ATTACHMENT_SIZE_LIMIT ?
				null : Utilities.base64Encode(attachment.getBytes()),
			size: attachment.getBytes().length
		}
	})
}

function handleSensitiveEmail(message, ips) {
	try {
		const emailLink = `https://mail.google.com/mail/u/0/#inbox/${message.getId()}`,
			subject = redactIPs(message.getSubject()).substring(0, 100),
			ipNotice = ips.length ? '⚠️ IP addresses detected' : ''
		sendToDiscord({
			content: [
				`-# @everyone`,
				`🚨 **Sensitive Email Alert**`,
				`\`📩\` **Subject:** ${subject}`,
				`\`🔗\` **Link:** ${emailLink}`,
				ipNotice
			].join('\n')
		})
		message.markRead()
	} catch (error) {
		console.error('Error handling sensitive email:', error)
	}
}

function formatDiscordMessage(email) {
	const emailLink = `https://mail.google.com/mail/u/0/#inbox/${email.messageId}`,
		content = [
			`-# @everyone`,
			`\`📨\` **From:** ${email.from}`,
			`\`📝\` **Subject:** ${email.subject}`,
			`\`📅\` **Date:** ${new Date(email.date).toLocaleString()}`,
			`\`🔗\` **Gmail Link:** ${emailLink}`,
			'**Preview:**',
			email.body
		].join('\n')
	return {
		content: content.substring(0, 2000),
		files: email.attachments
			.filter(a => a.data)
			.slice(0, 10)
			.map(a => ({ name: a.name, data: a.data }))
	}
}

function sendToDiscord(message) {
	try {
		const now = Date.now()
		rateLimitQueue = rateLimitQueue.filter(timestamp => now - timestamp < 60000)
		if (rateLimitQueue.length >= 3) {
			const oldest = rateLimitQueue[0],
				delay = Math.max(60000 - (now - oldest), 0)
			Utilities.sleep(delay)
			rateLimitQueue.shift()
		}
		const payload = {
			method: 'post',
			payload: {
				content: message.content.substring(0, 2000),
				...(message.files ? Object.assign({}, ...message.files.map((file, index) => ({
					[`files[${index}]`]: Utilities.newBlob(
						Utilities.base64Decode(file.data),
						'application/octet-stream',
						file.name
					)
				}))) : {})
			}
		}
		const response = UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, payload)
		if (response.getResponseCode() !== 200) {
			console.error('Discord API error:', response.getContentText())
			return
		}
		rateLimitQueue.push(Date.now())
		PropertiesService.getScriptProperties().setProperty(RATE_LIMIT_KEY, JSON.stringify(rateLimitQueue))
	} catch (error) {
		console.error('Error sending to Discord:', error)
	}
}