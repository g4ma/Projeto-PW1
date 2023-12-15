# EstacionaAqui: Uma aplicação que auxilia a localização de vagas de estacionamento
## Projeto para disciplina de Programação para Web 2023.2

Grupo:
- [Gabriella](https://github.com/gabs44)
- [Maria Clara](https://github.com/marysclair)
- [Maurício](https://github.com/maueici0)

## Descrição do projeto

Este projeto tem como principal objetivo resolver o desafio da falta de divulgação e conhecimento das vagas disponíveis em estacionamentos, oferecendo um sistema no qual os proprietários de estacionamentos podem registrar todas as vagas disponíveis. Qualquer pessoa registrada no sistema teria a capacidade de fazer uma reserva de vaga, desde que ela estivesse disponível. Isso resultaria em uma redução significativa da dificuldade e do tempo gastos na busca por vagas de estacionamento, tornando todo o processo mais simples e conveniente.

## Executando o projeto
Para executar o projeto para os testes de integração, crie um arquivo .env com as variáveis de ambiente do prisma, com a porta do servidor e com o secret usado no JWT da seguinte forma:

```
DATABASE_URL = 
SERVER_PORT = 
SECRET =
```

Para executar o backend desse projeto (este repositório), é necessário possuir o Docker Desktop instalado no seu computador

1. Caso não possua o Docker, é possível realizar a instalação atráves do site oficial, de acordo com o seu sistema operacional.
[Instalar aqui](https://www.docker.com/products/docker-desktop/)

2. Clone esse repositório em um diretório na sua máquina
```
git clone https://github.com/gabs44/projeto1-bdII.git
```
3. Por fim, execute os seguintes comandos no terminal. Certifique-se de que o Docker Desktop está em execução.

```
cd env
docker-compose up projeto redis
```

Execute os seguintes comandos no terminal para baixar as dependências e executar a API em modo de desenvolvimento

```
npm install
npm run dev
```

## Documentação

Usuários
URL	| Método | Descrição
------|------------|-----
/users |	POST |	Recurso de criação de usuários, espera um json no corpo da requisição
/users/:id	| GET |	Recurso de exibição de dados do usuário, recebe o id de usuário como parâmetro
/users/:id |	PATCH	| Recurso de atualização parcial das informações do usuário, espera um json no corpo da requisição e recebe o id do usuário como parâmetro
/users/:id	| PUT	| Recurso de atualização total das informações do usuário, espera um json no corpo da requisição e recebe o id do usuário como parâmetro
/users/:id	| DELETE |	Recurso de exclusão de usuários que recebe um id como parâmetro

Autenticação
URL	| Método | Descrição
------|------------|-----
/login |	POST |	Recurso de fazer login e autenticar usuário, espera um json no corpo da requisição

Usuário proprietário
URL	| Método | Descrição
------|------------|-----
/owners/:id |	PUT |	Recurso de fazer atualizar chave pix de usuário proprietário, espera um json no corpo da requisição e recebe o id do usuário como parâmetro

Vagas de estacionamento
URL	| Método | Descrição
------|------------|-----
/parkingSpaces |	POST |	Recurso de criação de vagas de estacionamento, espera um multpart/form no corpo da requisição
/parkingSpaces	| GET |	Recurso de exibição de dados de todas as vagas de estacionamento cadastradas
/parkingSpaces/:id	| GET |	Recurso de exibição de dados de uma vaga de estacionamento, recebe o id da vaga de estacionamento
/parkingSpaces/:id |	PATCH	| Recurso de atualização parcial das informações da vaga de estacionamento, espera um json no corpo da requisição e recebe o id da vaga de estacionamento como parâmetro
/parkingSpaces/:id	| DELETE |	Recurso de exclusão de vagas de estacionamento que recebe um id como parâmetro

Reservas de vaga de estacionamento
URL	| Método | Descrição
------|------------|-----
/reservations |	POST |	Recurso de criação de reserva de vaga de estacionamento, espera um json no corpo da requisição
/reservations/user	| GET |	Recurso de exibição de dados de todas as reservas feitas pelo usuário
/reservations/owner	| GET |	Recurso de exibição de dados de todas as reservas feitas das vagas de estacionamento cadastradas pelo usuário proprietário
/reservations/payment/:reservationId |	PATCH	| Recurso de atualização do status de pagamento de uma reserva pelo usuário proprietário, espera um json no corpo da requisição e recebe o id da reserva como parâmetro
/reservations/date/:reservationId |	PATCH	| Recurso de atualização da data e horário final de uma reserva, espera um json no corpo da requisição e recebe o id da reserva como parâmetro
/reservations/:reservationId	| DELETE |	Recurso de exclusão de reservas feitas pelo usuário que recebe um id como parâmetro

Imagens
URL	| Método | Descrição
------|------------|-----
/pictures/parkingSpace |	POST |	Recurso de criação de imagens de uma vaga de estacionamento, espera um json no corpo da requisição
/pictures/:parkingSpaceId	| GET |	Recurso de exibir todas as imagens de uma vagas de estacionamento
/pictures/:id	| DELETE |	Recurso de exclusão de imagens de uma vaga de estacionamento que recebe um id como parâmetro