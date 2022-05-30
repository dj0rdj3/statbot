FROM node:latest
RUN mkdir -p /statbot
WORKDIR /statbot
RUN npm install discord.js redis@next @discordjs/builders @discordjs/rest discord-api-types
COPY src/ /statbot/
CMD ["nodejs", "index.js"]
