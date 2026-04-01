## 📖 GUIA DE USO - Componentes e Dashboards

### 🎯 Fase 6 - Componentes Especializados

#### 1. RatingStars

```tsx
import { RatingStars } from '@/components/ui';

// Modo exibição
<RatingStars
  rating={4.5}
  size="md"
  showCount
  reviewCount={128}
/>

// Modo interativo
<RatingStars
  rating={0}
  interactive
  onChange={(rating) => console.log(rating)}
  allowHalf
/>
```

**Props:**
- `rating`: 0-5 (número)
- `size`: 'xs' | 'sm' | 'md' | 'lg'
- `interactive`: boolean (permite click)
- `allowHalf`: boolean (permite meia estrela)
- `showCount`: boolean (mostra reviews)
- `reviewCount`: número de reviews

---

#### 2. HotelCard

```tsx
import { HotelCard } from '@/components/ui';

<HotelCard
  title="Hotel Termas DiRoma"
  images={[
    "https://...",
    "https://..."
  ]}
  location="Caldas Novas, GO"
  rating={4.8}
  reviewCount={245}
  price={450}
  discountedPrice={350}
  amenities={['wifi', 'restaurant', 'gym']}
  badge="TOP ESCOLHA"
  isFavorite={false}
  onFavoriteChange={(fav) => console.log(fav)}
/>
```

**Props:**
- `title`: string (nome do hotel)
- `images`: string[] (URLs de imagens)
- `location`: string (localização)
- `rating`: 0-5
- `reviewCount`: número
- `price`: número (preço cheio)
- `discountedPrice`: número (opcional, preço com desconto)
- `amenities`: Array<'wifi' | 'restaurant' | 'gym'>
- `badge`: string (opcional, texto do badge)
- `isFavorite`: boolean
- `onFavoriteChange`: função

---

#### 3. FlashDealCard

```tsx
import { FlashDealCard } from '@/components/ui';

<FlashDealCard
  title="Pacote Caldas Novas"
  description="3 diárias com transporte incluído"
  originalPrice={1500}
  discountedPrice={999}
  totalSlots={50}
  slotsRemaining={3}
  endTime="2026-04-01T18:00:00Z"
  image="https://..."
  onReserve={() => console.log('Reservar!')}
/>
```

**Props:**
- `title`: string
- `description`: string
- `originalPrice`: número
- `discountedPrice`: número
- `totalSlots`: número total
- `slotsRemaining`: número de vagas restantes
- `endTime`: ISO string (data/hora de expiração)
- `image`: string (opcional, URL da imagem)
- `onReserve`: função callback

---

#### 4. ExcursionCard

```tsx
import { ExcursionCard } from '@/components/ui';

<ExcursionCard
  title="Passeio Ecológico no Parque Estadual"
  description="Trilha com guia especializado"
  duration={180} // minutos
  startingPoint="Centro de Caldas"
  rating={4.9}
  reviewCount={89}
  price={150}
  totalSpots={20}
  remainingSpots={2}
  organizer="Turismo Local"
  isOrganizerVerified={true}
  included={['Guia', 'Seguro', 'Lanches']}
  image="https://..."
  onBook={() => console.log('Booking!')}
/>
```

**Props:**
- `title`: string
- `description`: string
- `duration`: número (minutos)
- `startingPoint`: string
- `rating`: 0-5
- `reviewCount`: número
- `price`: número (por pessoa)
- `totalSpots`: número total
- `remainingSpots`: número
- `organizer`: string (nome organizador)
- `isOrganizerVerified`: boolean
- `included`: string[] (itens inclusos)
- `image`: string (opcional)
- `onBook`: função

---

## 🖥️ Fase 4 - Dashboards Admin

### Acessando os Dashboards

#### Financial Dashboard
```
URL: /admin/financeiro
Rota: client/src/pages/admin/financeiro.tsx
```

**Features:**
- 4 KPI Cards com mini-gráficos
- Filtros por período e categoria
- Gráficos interativos (GMV, Conversão)
- Split de pagamento visual
- Simulador de descontos
- Tabela de transações

**Como usar filtros:**
```tsx
// Na UI, selecione:
- Período: 7d, 30d, 90d, YTD
- Categoria: Todos, Hotéis, Excursões, Transporte

// Os dados se filtram automaticamente
```

#### Live Chat Admin
```
URL: /admin/live-chat
Rota: client/src/pages/admin/live-chat.tsx
```

**Layout em 3 Painéis:**

1. **Painel Esquerdo (Conversas)**
   - Buscar cliente
   - Click para selecionar conversa
   - Indicador de mensagens não lidas

2. **Painel Central (Chat)**
   - Histórico de mensagens
   - Input para responder
   - Anexos e emojis

3. **Painel Direito (Contexto)**
   - Perfil do cliente
   - Compras recentes
   - Reservas ativas

**Como enviar mensagem:**
```
1. Digite a mensagem no input
2. Aperte ENTER ou clique no botão Enviar
3. Mensagem aparece como "Agente"
```

---

## 🔧 Customização

### Mudar Cores

Edite as classes Tailwind nos componentes:

```tsx
// Exemplo: alterar cor primária de blue-600 para purple-600
<div className="bg-purple-600 text-white">
  // conteúdo
</div>
```

### Mudar Tamanhos

```tsx
// RatingStars
<RatingStars size="lg" /> // maior

// HotelCard
// Ajuste em hotel-card.tsx na linha de aspect-video
className="aspect-video" // altere conforme necessário
```

### Adicionar Mais Filtros

```tsx
// Em financeiro.tsx, adicione nova categoria:

const categoria2 = "seguro"; // nova categoria

<SelectItem value="seguro">Seguros</SelectItem>
```

---

## 🧪 Testando os Componentes

### RatingStars
```tsx
// Test interativo
const [rating, setRating] = useState(0);
<RatingStars
  rating={rating}
  interactive
  onChange={setRating}
  showCount
  reviewCount={0}
/>
```

### HotelCard
```tsx
// Test favorito
const [fav, setFav] = useState(false);
<HotelCard
  isFavorite={fav}
  onFavoriteChange={setFav}
  // ... outros props
/>
```

### FlashDealCard
```tsx
// Timer real
<FlashDealCard
  endTime={new Date(Date.now() + 3600000).toISOString()}
  // ... outros props
/>
// Countdown visível em tempo real
```

---

## 📱 Responsividade

### Mobile
- Grid 1 coluna
- Cards full-width
- Font reduzido em mobile

### Tablet
- Grid 2 colunas
- Cards adaptados

### Desktop
- Grid até 4 colunas
- Layout otimizado

### Live Chat Mobile
```
- Painel esquerdo em drawer
- Painel central principal
- Painel direito em sheet
```

---

## 🔗 Integração com Backend

### Para conectar dados reais:

```tsx
// Em financeiro.tsx, substitua dados mockados:

const [dados, setDados] = useState([]);

useEffect(() => {
  fetch('/api/financeiro')
    .then(r => r.json())
    .then(d => setDados(d))
}, []);
```

### Para Live Chat em tempo real:

```tsx
// Adicione WebSocket:

useEffect(() => {
  const ws = new WebSocket('wss://...');
  ws.onmessage = (msg) => {
    setMensagens(prev => [...prev, msg]);
  };
}, []);
```

---

## 🎯 Próximas Steps

1. **Coletar dados reais** - Integrar com API
2. **Adicionar autenticação** - Proteger rotas
3. **WebSockets** - Chat em tempo real
4. **Notificações** - Alertar sobre novos chats
5. **Export CSV** - Relatórios downloadáveis
6. **Mobile app** - Versão React Native

---

**Documentação v1.0** - 31 de Março de 2026
