package main

import (
	"bytes"
	"log"
	"net/http"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

const (
	QUEUE_NAME = "weather_queue"
	// CRÍTICO: O Go chamará o serviço 'nestjs_api' dentro da rede do Docker
	API_URL = "http://nestjs_api:3000/api/weather/logs"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

func sendToAPI(jsonData []byte) {
	// Cria a requisição POST
	req, err := http.NewRequest("POST", API_URL, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("ERRO ao criar requisição: %v", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	// Envia a requisição
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("ERRO ao enviar para API: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 || resp.StatusCode == 201 {
		log.Printf(" [v] Sucesso! Dados enviados para API NestJS.")
	} else {
		log.Printf(" [!] API retornou erro: %d", resp.StatusCode)
	}
}

func main() {
	// 1. Conexão com o RabbitMQ
	conn, err := amqp.Dial("amqp://guest:guest@rabbitmq:5672/")
	if err != nil {
		log.Fatalf("ERRO FATAL: Falha ao conectar ao RabbitMQ: %v", err)
	}
	defer conn.Close()
	log.Println("Conexão estabelecida com sucesso ao RabbitMQ.")

	ch, err := conn.Channel()
	failOnError(err, "Falha ao abrir o canal")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		QUEUE_NAME, false, false, false, false, nil,
	)
	failOnError(err, "Falha ao declarar a fila")

	msgs, err := ch.Consume(
		q.Name, "", true, false, false, false, nil,
	)
	failOnError(err, "Falha ao registrar o consumidor")

	var forever chan struct{}

	go func() {
		for d := range msgs {
			log.Printf(" [x] Recebido da Fila: %s", d.Body)
			// TAREFA 7: Enviar para o NestJS
			sendToAPI(d.Body)
		}
	}()

	log.Printf(" [*] Aguardando mensagens. CTRL+C para sair.")
	<-forever
}
