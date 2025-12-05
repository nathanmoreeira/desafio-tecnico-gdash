import pika
import requests
import json
import time

# Constantes de Configuração
# CRÍTICO: 'rabbitmq' é o nome do serviço no docker-compose
RABBITMQ_HOST = 'rabbitmq' 
QUEUE_NAME = 'weather_queue'

# Configuração da API de Clima (Exemplo: Open-Meteo, São Paulo)
# Você pode usar o OpenWeather, mas precisará de uma chave de API.
WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo"

def fetch_weather_data():
    """Busca dados de clima e extrai campos relevantes (Tarefa 4)"""
    try:
        response = requests.get(WEATHER_API_URL)
        response.raise_for_status() # Levanta erro para códigos HTTP ruins
        
        data = response.json()
        current = data.get('current', {})

        # Normalização dos Dados
        normalized_data = {
            "timestamp": time.time(), # Usando timestamp atual
            "city": "Sao Paulo", 
            "temperature_c": current.get('temperature_2m'),
            "weather_code": current.get('weather_code'),
        }
        return normalized_data
        
    except requests.exceptions.RequestException as e:
        print(f"ERRO: Falha ao buscar dados da API de clima: {e}")
        return None

def connect_and_publish(channel, data):
    """Envia a mensagem normalizada para a fila RabbitMQ"""
    
    # Envia os dados normalizados em JSON para a fila
    message = json.dumps(data)
    
    channel.basic_publish(
        exchange='',
        routing_key=QUEUE_NAME,
        body=message
    )
    print(f" [x] Enviado JSON para a fila '{QUEUE_NAME}': {message[:50]}...")

def main():
    # Loop de tentativa de conexão (Importante para microsserviços)
    while True:
        try:
            # 1. Conexão com o RabbitMQ (usando o nome do serviço)
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST)
            )
            channel = connection.channel()

            # 2. Declaração da Fila (deve ser a mesma que o Go Worker está escutando)
            channel.queue_declare(queue=QUEUE_NAME, durable=False)

            print("Conexão com RabbitMQ estabelecida. Iniciando coleta...")
            
            # Loop principal de coleta periódica (A GDASH sugere a cada 1 hora)
            while True:
                weather_data = fetch_weather_data()
                
                if weather_data:
                    connect_and_publish(channel, weather_data)
                
                # Intervalo de envio (Usamos 5s para testes, mude para 3600s na entrega final)
                time.sleep(5) 
                
        except pika.exceptions.AMQPConnectionError as e:
            print(f"ERRO: Conexão com RabbitMQ perdida. Tentando reconectar em 5s...")
            time.sleep(5)
        except Exception as e:
            print(f"ERRO inesperado no collector: {e}")
            time.sleep(5)

if __name__ == '__main__':
    main()