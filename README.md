
# Salgados da Gê

Aplicação web para um empreendimento no ramo de vendas de salgados em um condomínio.

Para utilizar as funcionalidades é preciso realizar o registro atráves da sua conta google. Por padrão o usuário obtém o acesso de cliente, que dá permissão para realizar pedidos no menu principal.

Para obter acesso de administrador, é necessário alterar o nível de permissão no banco. Assim o usuário pode acessar a tabela com todas as vendas. Lá ele pode cadastrar, atualizar ou deletar vendas, além de ter controle do estoque de produtos. Quando um produto estiver com estoque esgotado, não será possível realizar novas vendas dele.
## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/diegonacif/salgados-da-ge.git
```

Entre no diretório do projeto

```bash
  cd salgados-da-ge
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm run dev
```


## Deploy

Link para visualizar o deploy desse projeto:

- [Salgados da Gê](https://salgados-da-ge.vercel.app/)
## Aprendizados

* Trabalhar com as várias necessidades do carrinho de compras, onde foi necessário incluir variáveis condicionais como por exemplo desconto e troco para o caso de pagamento em dinheiro.

* Fazer uso de toasts de forma global na aplicação.

* Formas diferentes de validações, que surgiram de acordo com as necessidades das regras de negócio.

* Implementar sistema de login com diferentes níveis de acesso.

* Restrições de rotas de acordo com nível de acesso de usuário.

* Implementar botão de copiar para área de transferência.

## Screenshots

![App Screenshot - 01](https://images2.imgbox.com/93/5b/1Ok2Gr65_o.png)

![App Screenshot - 02](https://images2.imgbox.com/bf/14/j0FTerhb_o.png)

![App Screenshot - 03](https://images2.imgbox.com/55/56/i3uEcVFr_o.png)

![App Screenshot - 04](https://images2.imgbox.com/3f/9b/B7CZbIRL_o.png)

![App Screenshot - 05](https://images2.imgbox.com/e9/a9/uJzF9PyB_o.png)

![App Screenshot - 06](https://images2.imgbox.com/88/9e/Dbh6oU8i_o.png)

![App Screenshot - 07](https://images2.imgbox.com/a1/c0/eibbIJjw_o.png)

![App Screenshot - 08](https://images2.imgbox.com/2e/98/xjPxmQ0y_o.png)

![App Screenshot - 09](https://images2.imgbox.com/78/fd/OP1kUMV8_o.png)



## Stack utilizada

**Front-end:** ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)



## Autor

- [Diego Nacif](https://www.github.com/diegonacif)

