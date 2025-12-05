# -- Stage 1: Construção (Build Stage) --
# Agora usamos a versão 1.25.5, compatível com seu go.mod
FROM golang:1.25-alpine AS builder 
WORKDIR /app
COPY go.mod go.sum ./
# Baixa as dependências (agora o GOPROXY no compose irá ajudar)
RUN go mod download
COPY . .
# Compila o binário
RUN CGO_ENABLED=0 go build -o worker ./main.go

# -- Stage 2: Produção (Final Stage) --
# Usamos uma imagem base minúscula
FROM alpine:latest
ENV TZ=America/Sao_Paulo
WORKDIR /root/
# Copia o binário compilado do Stage 1
COPY --from=builder /app/worker .
# Garante permissão de execução (para evitar o erro final de permissão)
RUN chmod +x worker 
# Comando para rodar
CMD ["./worker"]