FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código fonte
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "run", "start:prod"]