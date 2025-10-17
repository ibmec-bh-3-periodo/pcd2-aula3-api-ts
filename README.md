# [PCD2] AULA 3 - Utilizando Express com TypeScript

## Índice

1. [Configuração completa do projeto](#configuração-completa-do-projeto)

2. [Aprofundando: Escrevendo em um Arquivo JSON com Express](#aprofundando-escrevendo-em-um-arquivo-json-com-express)
   
   2.1. [Escrevendo Dados em um Arquivo JSON com Express: `writeFile`](#escrevendo-dados-em-um-arquivo-json-com-express-writefile)

   2.2. [Lendo Dados de um Arquivo JSON com Express: `readFile`](#lendo-dados-de-um-arquivo-json-com-express-readfile)

---

## Configuração completa do projeto

### 1. Na pasta do projeto, execute o comando abaixo para iniciar o projeto com um arquivo `package.json` básico:  
```bash
npm init -y
```
---

### 2. Abra o arquivo **package.json** e faça as seguintes modificações:

| Campo              | Valor                                      |
|--------------------|--------------------------------------------|
| `"description"`    | `"Criando API-REST Express e Typescript"`           |
| `"main"`           | `"src/server.ts"`                          |
| `"scripts"`        | `{}` (Deixe vazio por enquanto)            |
| `"author"`         | `"Tamara Simões"` (ou o seu nome)      |

---

### 3. Crie uma pasta `src` e dentro dela um arquivo **server.js**:  
```plaintext
src/
└── server.ts
```

---

### 4. Agora vamos configurar o TypeScript no projeto. 
Execute o comando abaixo para instalar o TypeScript e as definições de tipos para o Node.js como dependências de desenvolvimento. Vamos trabalhar com uma versão específica, apontada como a mais estável no momento.
 
```bash
npm i typescript@5.5.4 @types/node@20.14.12 -D
```

- `typescript` → Biblioteca TypeScript na versão 5.5.4 
- `@types/node` → Tipagens para o Node.js da versão 20.14.12
- `-D` → Instala como dependência de desenvolvimento  

O arquivo **package.json** será atualizado com as novas dependências:  

| Dependência           | Versão               | Tipo                  |
|-----------------------|-----------------------|------------------------|
| `typescript`          | `^5.5.4`              | DevDependency          |
| `@types/node`         | `^20.14.12`           | DevDependency          |

**O que o TypeScript faz?**
- O TypeScript converte o código para **JavaScript**.
- Em produção, o TypeScript não será necessário — apenas o JavaScript será executado.
- O TypeScript ajuda durante o desenvolvimento, fornecendo **tipagem estática** e **verificações de tipo**.

---

### 5. Configurando TypeScript com Node.js usando TSX
   
✅ **Por que devemos fazer isso?**  
O Node.js não consegue interpretar diretamente arquivos TypeScript (`.ts`). Portanto, precisamos converter TypeScript para JavaScript (transpilar) para que o Node consiga executar — **processo improdutivo**.

Para resolver isso, o **TSX** é uma ferramenta que permite rodar diretamente arquivos TypeScript sem precisar transpilar manualmente. Com o TSX, o código TypeScript é convertido e executado automaticamente em tempo de execução.  

a) Instale o TSX como dependência de desenvolvimento:

```bash
npm i tsx@4.16.2 -D
```

b) Crie um **script de execução** no `package.json`:

```json
"scripts": {
  "dev": "tsx watch src/server.ts"
}
```

- `tsx` → roda o arquivo TypeScript.  
- `watch` → observa mudanças no código e reinicia automaticamente o servidor.  

---

### 6. Configurando TypeScript com `tsconfig.json`
O TypeScript precisa de um arquivo de configuração (`tsconfig.json`) para funcionar corretamente, principalmente quando o projeto estiver em `deploy`.

a) Execute o comando para gerar o arquivo de configuração:

```bash
npx tsc --init
```

Será criado o arquivo **tsconfig.json** com várias propriedades comentadas.

b) Configurações importantes no `tsconfig.json`: Configure apenas o essencial para rodar com Node.js de forma otimizada.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "lib": ["ES2022"],
    "moduleResolution": "Node16",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
    "resolveJsonModule": true
  }
}
```

#### **Explicação das Propriedades**
| Propriedade | Explicação |
|------------|------------|
| `target` | Define a versão do JavaScript para o qual o TypeScript será compilado |
| `module` | Define o sistema de módulos (CommonJS, ESNext, etc.) |
| `lib` | Define as bibliotecas que o TypeScript vai incluir na análise de código |
| `moduleResolution` | Resolve caminhos de módulo de forma compatível com Node.js |
| `esModuleInterop` | Permite importar módulos CommonJS usando `import` |
| `forceConsistentCasingInFileNames` | Garante que nomes de arquivos tenham letras maiúsculas e minúsculas consistentes |
| `strict` | Ativa um conjunto de regras para deixar o código mais seguro |
| `skipLibCheck` | Ignora verificação de arquivos `.d.ts` (tipagem) |
| `resolveJsonModule` | Permite importar arquivos `.json` |

---

### 7. Instale a versão do Express indicada para projetos com Typescript

```bash
npm i express@4.19.2
```

Também é necessário instalar o mecanismo de importação do Express, necessário para projetos em TypeScript.

```bash
npm i --save-dev @types/express
```

**E assim, seu projeto estará configurado por completo para implementação e execução da API.**


### 🎯 Resumo Completo
✅ `npm init -y` → Cria o `package.json`  
✅ `npm install typescript tsx@4.16.2 -D` → Instala TypeScript e TSX  
✅ `npx tsc --init` → Cria `tsconfig.json`  
✅ Configurações em `tsconfig.json` → Define opções de compilação  
✅ Cria pasta `src` e arquivo `server.ts` → Escreve o código TypeScript  
✅ Adiciona script `dev` → Facilita rodar com TSX  
✅ `npm i express@4.19.2` → Instala o Express
✅ `npm run dev` → Roda o servidor com TypeScript diretamente  

---

## Aprofundando: Escrevendo em um Arquivo JSON com Express

Até agora, ao utilizar os métodos POST e PUT em Express, os dados eram armazenados apenas em memória. Isso significa que, ao reiniciar o servidor, as informações eram perdidas. Para persistir dados entre reinicializações, precisamos gravá-los em um arquivo, como um arquivo `.json`. O Express por si só não fornece essa funcionalidade, então utilizamos o módulo **fs** (file system) do Node.js para manipular arquivos diretamente.

Nesta seção, vamos aprender a criar rotas que permitem adicionar e listar dados de um arquivo `.json` usando o **Express**.

### O módulo `fs` - Manipulando Arquivos no Sistema

O módulo `fs` (file system) é um módulo nativo do Node.js que fornece funções para interagir com o sistema de arquivos. Com ele, é possível realizar operações como:

- **Ler arquivos**: Acessar o conteúdo de arquivos no servidor.
- **Escrever arquivos**: Adicionar ou atualizar dados em arquivos.
- **Excluir arquivos**: Remover arquivos do sistema.
  
A principal função que usaremos aqui é a de **escrever** em um arquivo `.json` usando o método `fs.writeFile`.

Para utilizar o `fs` no seu projeto, primeiro, importe-o no arquivo onde você deseja manipulá-lo:

```typescript
import fs from 'fs';
```

#### Escrevendo Dados em um Arquivo JSON com Express: `writeFile`

Agora que já temos o módulo `fs` importado, podemos criar uma rota POST que receberá dados do corpo da requisição e os gravará em um arquivo `.json`.

Imagine que temos um arquivo chamado `data.json` que armazena uma lista de produtos, e queremos adicionar novos produtos a esse arquivo. As importações necessárias foram feitas:

```typescript
import express, { Request, Response } from "express";
import data from "./data.json";
import fs from "fs";

const api = express();
api.use(express.json());
const port = 3333;
```

Para escrever os dados em `data.json` e não mais manter as atualizações apenas em memória, observe os passos:

a) **Rota POST**: A rota `/produtos` é criada e recebe um novo produto no corpo da requisição, armazenado na constante `newData`. A seguir, os dados adicionados em `newData` são levados para `data`. 

Isso não muda em nada o que já conhecemos sobre Express.

```typescript
api.post("/add", (req: Request, res: Response) => {
  const newData = req.body;

  data.push(newData);
```

> **Importante**: A tipagem explícita aconteceu neste caso porque as propriedades `Request` e `Response` foram importadas.

b) **Escrita no Arquivo**: Usamos `fs.writeFile()` para sobrescrever o conteúdo do arquivo com os dados atualizados. A estrutura básica deste método é a seguinte:

```typescript
fs.writeFile(caminho, dados, [opções], callback);
```

Os parâmetros do método `writeFile` são:

1. **`caminho`** (string): O caminho do arquivo onde você quer salvar os dados. Esse caminho pode ser relativo ou absoluto.
2. **`dados`** (string | Buffer): Os dados que você deseja escrever no arquivo. No seu caso, como você está manipulando JSON, geralmente você usa `JSON.stringify()` para converter os dados de um objeto para uma string JSON antes de escrever no arquivo.
3. **`opções`** (opcional) (objeto): Esse parâmetro é opcional e permite que você defina algumas opções, como o encoding ou as permissões do arquivo. Se você não passar nada, o padrão será `'utf8'` (um encoding de texto comum).
4. **`callback`** (função): A função que será chamada após a tentativa de escrita. Ela recebe um parâmetro de erro (se houver).

Atualizando a rota POST do exemplo, o código agora fica assim:

```typescript
// api.post("/add", (req: Request, res: Response) => {
//  const newData = req.body;

//  data.push(newData);

  fs.writeFile("./src/data.json", JSON.stringify(data, null, 2), () => {});
```

- **`./src/data.json`** é o caminho onde o arquivo será salvo.
- **`JSON.stringify(data, null, 2)`** converte o array `data` em uma string JSON com espaçamento de 2 para formatação. Isso torna o arquivo mais legível para humanos.
- **O callback** é a função de resposta, que será chamada quando a operação de escrita terminar.

5. **Resposta para o Cliente**: Na função callback, se houver um erro, ele será passado como parâmetro que deve ser declarado na callback. Se não houver, pode apontar uma resposta satisfatória. Não é obrigatório tratar erros aqui, mas é altamente recomendável. O código completo ficaria assim:

```typescript
// api.post("/add", (req: Request, res: Response) => {
//  const newData = req.body;

//  data.push(newData);

  fs.writeFile("./src/data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Erro ao salvar os dados:", err);
      return res.status(500).send("Erro ao salvar os dados");
    }
    res.status(201).send("Dados salvos com sucesso");
  });
});
```

Neste caso, o que acontece aqui é o tratamento do possível erro, sendo que, caso ele não aconteça, uma resposta de sucesso é enviada ao usuário.

#### Lendo Dados de um Arquivo JSON com Express: `readFile`

Agora que já sabemos como escrever dados em um arquivo JSON, vamos aprender a **ler os dados** de um arquivo JSON usando o método `fs.readFile`. O método `readFile` permite ler o conteúdo de arquivos no sistema e, neste exemplo, vamos utilizá-lo para ler o conteúdo de `data.json` e enviar os dados de volta na resposta de uma rota GET.

Vamos analisar o exemplo abaixo para entender como isso funciona:

```typescript
// Resolve o caminho absoluto para o arquivo data.json
const dataFilePath = path.resolve(__dirname, "data.json");

api.get("/read", (req: Request, res: Response) => {
  // Usamos fs.readFile para ler o arquivo
  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      // Se ocorrer um erro ao ler o arquivo, retorna um erro
      res.status(500).send(`${err}`);
    } else {
      // Caso contrário, converte os dados JSON em um objeto e envia de volta
      const dados = JSON.parse(data);
      res.status(200).send(dados);
    }
  });
});
```

1. **Definindo o Caminho do Arquivo**:
**`const dataFilePath = path.resolve(__dirname, "data.json");`**: Utiliza `path.resolve()` para gerar o caminho absoluto para o arquivo `data.json`. Isso é útil para evitar problemas com caminhos relativos, especialmente quando o código é executado em diferentes ambientes.

2. **Rota GET `/read`**:
A rota GET `/read` será acionada quando o cliente fizer uma requisição GET para `/read`.
   
3. **Leitura do Arquivo JSON**:
**`fs.readFile(dataFilePath, "utf8", (err, data) => {...})`**: O método `readFile` tenta ler o conteúdo do arquivo `data.json`. O primeiro parâmetro é o caminho do arquivo (no caso, o caminho absoluto gerado pela função `path.resolve`), e o segundo parâmetro é o encoding (usamos `"utf8"` para ler o arquivo como texto). O terceiro parâmetro é uma **função callback** que recebe dois parâmetros: um **erro** (caso ocorra algum problema ao ler o arquivo) e o **conteúdo do arquivo** (`data`), que será uma string.
  
Explicando melhor, o `readFile` tem a seguinte estrutura básica:

```typescript
fs.readFile(caminho, encoding, callback);
```

Onde:

a. **`caminho`** (string): O caminho do arquivo que você deseja ler. Pode ser um caminho relativo ou absoluto.
   
b. **`encoding`** (string): O tipo de codificação a ser utilizado para ler o arquivo. Geralmente, utilizamos `"utf8"` para arquivos de texto.

c. **`callback`** (função): A função de callback que será chamada após a leitura do arquivo. Ela recebe dois parâmetros:
   - **`err`**: Um parâmetro que contém o erro (se houver) que ocorreu ao tentar ler o arquivo.
   - **`data`**: O conteúdo do arquivo lido (caso não tenha ocorrido erro).

4. **Tratamento de Erro**:
   - Se ocorrer algum erro (por exemplo, se o arquivo não existir ou se houver problemas ao acessá-lo), o **erro** será passado para o callback e, neste caso, é retornado uma resposta com status 500 e a mensagem de erro.

5. **Conversão do Conteúdo para JSON**:
   - Se a leitura for bem-sucedida, a variável `data` conterá uma string no formato JSON.
   - Usamos **`JSON.parse(data)`** para converter essa string JSON em um objeto JavaScript.

6. **Enviando a Resposta**:
   - O conteúdo do arquivo, agora convertido em um objeto JavaScript, é enviado de volta na resposta com **`res.status(200).send(dados)`**. O status `200` indica sucesso, e os dados são enviados como resposta.

### Considerações Importantes

- **Assincronismo**: Tanto o `readFile` quanto o `writeFile` são operações assíncronas, o que significa que elas não bloqueiam o restante do código. Usamos callbacks para manipular o fluxo após a leitura e escrita do arquivo.
  
- **Formato JSON**: Sempre que trabalhamos com arquivos `.json`, é importante garantir que os dados sejam serializados corretamente com `JSON.stringify()` e desserializados com `JSON.parse()`.

- **Erro de Leitura ou Escrita**: No exemplo, tratamos erros ao tentar ler ou escrever o arquivo, retornando uma resposta de erro para o cliente caso algo dê errado.