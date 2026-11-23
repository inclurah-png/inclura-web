# Third-party licence review: TextBee (AGPL-3.0)

**Decision:** Inclura may keep the TextBee adapter as a separately operated HTTP integration, subject to the separation and compliance conditions below. This review does not approve production SMS activation or deployment of the TextBee stack.

## Reviewed material

- Upstream project: https://github.com/textbee/textbee
- Upstream licence: GNU Affero General Public License v3.0 (AGPL-3.0): https://github.com/textbee/textbee/blob/main/LICENSE
- GNU licence text and explanation: https://www.gnu.org/licenses/agpl-3.0.en.html
- TextBee self-hosting guide: https://textbee.dev/docs/self-hosting
- TextBee SMS API documentation: https://textbee.dev/docs/sending-sms/sending-sms

The upstream repository identifies its API, web dashboard and Android app as AGPL-3.0 software. Review the licence file at the exact upstream revision used for any deployment; do not rely only on a repository badge.

## Scope and separation decision

Inclura's adapter calls the TextBee REST API over HTTPS. It does not copy TextBee source code, import its libraries, link to its server or Android application, or bundle TextBee code into Inclura. Keep TextBee as a separate service/process and preserve this API boundary.

On that basis, the adapter is intended to remain an independently written integration, not a derivative or combined work of TextBee. The AGPL licence on TextBee does not, merely because the two independent programs communicate over a documented HTTP API, automatically relicense Inclura's unrelated source code. This is a technical licensing assessment, not a binding legal opinion. Do not copy or adapt TextBee code into Inclura without a fresh licence review.

## Obligations if Inclura operates TextBee

1. **Unmodified self-hosted server/dashboard:** retain the upstream copyright, licence and notices. AGPL permits running an unmodified program. Keep the exact source revision and its licence available; the upstream public repository is the source for that unmodified revision.
2. **Modified server or dashboard:** if Inclura modifies an AGPL-covered TextBee program and users interact with that modified version remotely, AGPL-3.0 section 13 requires a prominent, no-charge offer to those users to obtain the Corresponding Source of the running modified version. Publish the exact corresponding source and build/run instructions, and clearly identify modifications and dates. Keep it available while the modified service is offered.
3. **Custom Android gateway app:** the official published app is configured for TextBee's hosted service; a self-hosted deployment requires a build configured for the self-hosted domain. Treat that custom build as a modified AGPL-covered app. If the APK is conveyed to staff, contractors, device operators or other recipients, provide the corresponding source, the AGPL licence and preserved copyright/notices with it. A public, versioned source fork with the exact build instructions is the clearest compliance route. Do not distribute a modified APK without its corresponding source and notices.
4. **No proprietary Inclura code in the TextBee fork:** keep the fork limited to TextBee and the minimal self-hosting configuration/build changes. Do not place Inclura backend code, private APIs, secrets, member data, SOS records or proprietary assets in that fork.
5. **Legal notices:** retain all upstream notices and licence text. Where the modified TextBee interface requires appropriate legal notices under the licence, display them and identify the source location.
6. **Dependencies:** preserve and review the licences of TextBee's dependencies and any additional components separately. This review does not certify the complete dependency tree.

## Conditions before deployment

- Pin a specific upstream TextBee commit/tag and record it in deployment documentation.
- Prefer an unmodified upstream server. If server code is changed, publish the matching source as described above.
- Maintain a separate public source fork for any modified Android build that is distributed; include the exact commit, build instructions and AGPL-3.0 notices.
- Do not expose MongoDB, Redis or database administration ports publicly. Expose only the HTTPS reverse proxy/API and dashboard as required; use strong unique secrets, backups, patching and access controls.
- Keep the TextBee API key only in the IFSE backend secret store. Never put it in Inclura frontend code, a mobile client, logs or a public repository.
- Keep SMS disabled by default. A separate explicit production decision is required after device, SIM, carrier charges, recipient consent, data minimisation, security and delivery-state handling are verified.
- Do not treat a TextBee 200 response as delivery. It means the batch was queued; use the documented status/webhook flow if delivery-state reporting is later implemented.

## Conclusion

The AGPL-3.0 licence is **not a reason by itself to abandon the HTTP adapter**. It does mean the TextBee server and custom Android app must be handled as separate AGPL components, with source and notice obligations whenever the relevant conditions are triggered. Inclura's proprietary application and backend must remain separate from TextBee's code. Obtain qualified legal advice before commercial deployment if there is any plan to combine code, redistribute modified components, or impose terms inconsistent with AGPL-3.0.

This document is an engineering compliance record, not legal advice.
