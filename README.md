# Os Quebradeiras — Site do Time

Site de gerenciamento do time, pronto para publicar no GitHub Pages.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub e suba todos os arquivos desta pasta (`index.html`, `style.css`, `script.js`, `data/`, `assets/`).
2. No repositório, vá em **Settings → Pages**.
3. Em "Branch", selecione `main` (ou a branch que você usou) e a pasta `/root`, depois salve.
4. Em alguns minutos o GitHub Pages vai gerar um link (algo como `https://seu-usuario.github.io/nome-do-repo/`) — é esse link que você compartilha com o time.

> Importante: o site precisa ser aberto por esse link (http/https), não abrindo o arquivo `index.html` direto no computador — isso é necessário tanto para carregar os dados iniciais (`data/dados.json`) quanto para a sincronização em nuvem funcionar.

## Como ativar a sincronização compartilhada (opcional, mas recomendado)

Por padrão, cada pessoa que edita o site (jogadores, escalação, campos, reservas, calendário etc.) só vê a própria edição — os dados ficam salvos apenas no navegador dela. Para que **qualquer pessoa possa editar e todo mundo veja a última versão editada**, siga estes passos (grátis, leva uns 2 minutos):

1. Crie uma conta grátis em [jsonbin.io](https://jsonbin.io).
2. No painel, vá em **API Keys** e copie a sua **X-Master-Key**.
3. Clique em **Create Bin**, cole `{}` como conteúdo e crie o bin.
4. Copie o **Bin ID** que aparece na URL do bin criado (ex: `65f1a2b3c4d5e6f7a8b9c0d1`).
5. Abra o arquivo `script.js`, procure o bloco `CLOUD_CONFIG` no topo do arquivo e preencha:

```js
const CLOUD_CONFIG = {
  enabled: true,                 // troque para true
  binId: 'SEU_BIN_ID_AQUI',
  apiKey: 'SUA_X-MASTER-KEY_AQUI'
};
```

6. Salve o arquivo, suba (`commit` + `push`) para o GitHub e pronto. Agora, sempre que alguém editar algo no site, a alteração é enviada para a nuvem e aparece automaticamente para todos os outros visitantes em até ~25 segundos (ou na hora, se a pessoa recarregar a página).

Um indicador no canto superior direito do site mostra o status da sincronização:
- 🟢 nuvem = sincronizado, visível pra todo mundo
- 🟡 girando = enviando alterações
- 🔴 alerta = sem conexão com a nuvem no momento (a edição continua salva localmente e será reenviada depois)
- ⚪ off = sincronização não ativada (modo local)

### Sobre as fotos

As fotos enviadas (de jogadores, técnicos e campos) **não são sincronizadas na nuvem** — elas são grandes demais para o plano gratuito do jsonbin.io (limite de 100kb por "bin"). Elas continuam sendo salvas normalmente, mas apenas no navegador/dispositivo de quem fez o upload da foto. Todo o resto (nomes, números, estatísticas, escalação, campos, cores, reservas, calendário, textos) é compartilhado com todo mundo.

Se no futuro você quiser sincronizar fotos também, é possível migrar para um serviço com mais espaço (ex: Firebase Storage ou Supabase Storage), mas isso exige uma configuração um pouco mais avançada.

### Segurança

Como o objetivo é que qualquer pessoa do time possa editar o site sem senha, a chave de API fica visível no código-fonte (`script.js`) — isso é intencional, mas significa que qualquer pessoa que veja o código também pode escrever diretamente no seu bin. Não guarde nada sensível ali além dos dados do time.

## Editar o site

Clique no botão **"Editar Site"** no topo da página para abrir o painel de administração, ou use os botões **"Editar"** dentro de cada seção (Técnicos, Jogador da Rodada, Elenco, Campos, Sobre, Calendário) para editar aquele conteúdo específico.

Na aba **Dados** do painel de administração você encontra:
- **Salvar alterações** — força um salvamento imediato.
- **Buscar versão mais recente** — busca a última versão sincronizada na nuvem (útil se você suspeitar que perdeu uma edição de outra pessoa).
- **Restaurar dados** — volta tudo para os dados padrão.
- **Exportar / Importar dados** — baixa ou carrega um arquivo `.json` de backup completo (inclusive fotos).
