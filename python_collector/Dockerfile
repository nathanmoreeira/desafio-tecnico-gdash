FROM python:3.11-slim
WORKDIR /app

# Copia e instala as dependências
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copia o código principal
COPY collector.py .

# Comando para rodar o coletor
CMD ["python", "collector.py"]