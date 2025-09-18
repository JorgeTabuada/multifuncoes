// Mapeamento completo dos dados reais do Firebase admin-multipark
// Baseado na estrutura real encontrada no diagnóstico

export const FIREBASE_COLLECTIONS = {
  RESERVAS: 'reservas',
  RECOLHAS: 'recolhas', // Vazia - usar dados de 'reservas' com filtro
  ENTREGAS: 'entregas',
  UTILIZADORES: 'utilizadores', // Vazia
  PRODUTIVIDADE: 'produtividade_condutores', // Vazia
  COMENTARIOS: 'comentarios_reclamacoes', // Vazia
  MARKETING: 'marketing' // Vazia
};

// Campos reais encontrados na coleção 'reservas' (principal)
export const RESERVAS_FIELDS = {
  // Identificação
  id: 'id',
  idClient: 'idClient',
  
  // Cliente
  name: 'name',
  lastName: 'lastName',
  email: 'email',
  phoneNumber: 'phoneNumber',
  taxName: 'taxName',
  taxNumber: 'taxNumber',
  
  // Veículo
  licensePlate: 'licensePlate',
  veiculo: 'veiculo', // Formato: "Marca, Modelo, Cor"
  brand: 'brand',
  model: 'model',
  color: 'color',
  
  // Localização e Parque
  park: 'park', // P2, PD, etc.
  parkBrand: 'parkBrand', // skypark, airpark, redpark, etc.
  city: 'city', // lisbon, porto, faro
  parking: 'parking', // "Descoberto 5€ / dia", etc.
  alocation: 'alocation', // Número da alocação (ex: "3001")
  row: 'row', // Fila (número)
  spot: 'spot', // Lugar (número)
  fila: 'fila', // Fila (string)
  lugar: 'lugar', // Lugar (string)
  
  // Datas e Horários
  bookingDate: 'bookingDate',
  checkinDate: 'checkinDate',
  checkoutDate: 'checkoutDate',
  checkIn: 'checkIn', // Formato: "16/02/2024, 17:45"
  checkOut: 'checkOut', // Formato: "20/02/2024, 19:30"
  inputTimeHours: 'inputTimeHours',
  inputTimeMinutes: 'inputTimeMinutes',
  outputTimeHours: 'outputTimeHours',
  outputTimeMinutes: 'outputTimeMinutes',
  historyDate: 'historyDate',
  
  // Estados e Ações
  stats: 'stats', // "Entregue", "recolhido", "cancelado", etc.
  action: 'action', // "Entrega", "Movimentação", "Cancelamento"
  checkoutDone: 'checkoutDone',
  
  // Preços e Pagamento
  bookingPrice: 'bookingPrice',
  paymentMethod: 'paymentMethod', // "Multibanco", "Dinheiro", etc.
  
  // Entrega
  delivery: 'delivery', // "Aeroporto Terminal 1 (10€)", etc.
  deliveryLocation: 'deliveryLocation', // URL do Google Maps
  returnFlight: 'returnFlight',
  
  // Serviços e Extras
  extraServices: 'extraServices', // Array
  
  // Observações e Ocorrências
  remarks: 'remarks',
  ocorrencia: 'ocorrencia',
  ocorrenciaType: 'ocorrenciaType',
  cancelamento: 'cancelamento',
  cancelamentoType: 'cancelamentoType',
  
  // Sistema
  user: 'user', // Email do utilizador que criou
  terms: 'terms',
  evaluation: 'evaluation'
};

// Campos da coleção 'entregas' (estrutura diferente)
export const ENTREGAS_FIELDS = {
  id: 'id',
  valor: 'valor', // "147,00 €"
  park: 'park', // "lisboa"
  estado: 'estado', // "Pendente"
  detalhes: 'detalhes',
  createdAt: 'createdAt', // Timestamp
  createdBy: 'createdBy' // UID do utilizador
};

// Valores possíveis para filtros (baseados nos dados reais)
export const FILTER_OPTIONS = {
  // Parques (campo 'park')
  PARKS: [
    { value: 'P2', label: 'P2' },
    { value: 'PD', label: 'PD' },
    { value: 'central_coberto', label: 'Central Coberto' },
    { value: 'central_descoberto', label: 'Central Descoberto' },
    { value: 'pd_coberto', label: 'PD Coberto' }
  ],
  
  // Marcas de Parque (campo 'parkBrand')
  PARK_BRANDS: [
    { value: 'skypark', label: 'SkyPark' },
    { value: 'airpark', label: 'AirPark' },
    { value: 'redpark', label: 'Red Park' },
    { value: 'topparking', label: 'Top Parking' },
    { value: 'lizpark', label: 'Liz Park' }
  ],
  
  // Cidades (campo 'city')
  CITIES: [
    { value: 'lisbon', label: 'Lisboa' },
    { value: 'porto', label: 'Porto' },
    { value: 'faro', label: 'Faro' }
  ],
  
  // Estados (campo 'stats')
  STATS: [
    { value: 'Entregue', label: 'Entregue' },
    { value: 'recolhido', label: 'Recolhido' },
    { value: 'cancelado', label: 'Cancelado' },
    { value: 'reservado', label: 'Reservado' },
    { value: 'Pendente', label: 'Pendente' }
  ],
  
  // Ações (campo 'action')
  ACTIONS: [
    { value: 'Entrega', label: 'Entrega' },
    { value: 'Movimentação', label: 'Movimentação' },
    { value: 'Cancelamento', label: 'Cancelamento' },
    { value: 'Recolha', label: 'Recolha' }
  ],
  
  // Métodos de Pagamento (campo 'paymentMethod')
  PAYMENT_METHODS: [
    { value: 'Multibanco', label: 'Multibanco' },
    { value: 'Dinheiro', label: 'Dinheiro' },
    { value: 'Cartão', label: 'Cartão' },
    { value: 'Transferência', label: 'Transferência' }
  ],
  
  // Tipos de Entrega (campo 'delivery')
  DELIVERY_TYPES: [
    { value: 'Aeroporto Terminal 1 (10€)', label: 'Terminal 1' },
    { value: 'Aeroporto Terminal 2 (10€)', label: 'Terminal 2' },
    { value: 'Sem entrega', label: 'Sem Entrega' }
  ]
};

// Funções utilitárias para trabalhar com os dados
export const FirebaseUtils = {
  
  // Converter data do Firebase para Date
  parseFirebaseDate: (dateString) => {
    if (!dateString) return null;
    
    // Formato: "16/02/2024, 17:45" ou "2024-02-16"
    if (dateString.includes(',')) {
      const [datePart, timePart] = dateString.split(', ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      return new Date(year, month - 1, day, hours, minutes);
    } else if (dateString.includes('-')) {
      return new Date(dateString);
    }
    
    return new Date(dateString);
  },
  
  // Extrair informações do veículo
  parseVehicleInfo: (veiculo) => {
    if (!veiculo) return { brand: '', model: '', color: '' };
    
    // Formato: "Marca, Modelo, Cor"
    const parts = veiculo.split(', ');
    return {
      brand: parts[0] || '',
      model: parts[1] || '',
      color: parts[2] || ''
    };
  },
  
  // Formatar preço
  formatPrice: (price) => {
    if (!price) return '0,00 €';
    
    // Se já tem formato "147,00 €", retornar como está
    if (price.includes('€')) return price;
    
    // Converter número para formato português
    const num = parseFloat(price);
    return `${num.toFixed(2).replace('.', ',')} €`;
  },
  
  // Verificar se é recolha, entrega ou reserva
  getRecordType: (record) => {
    const action = record.action?.toLowerCase();
    const stats = record.stats?.toLowerCase();
    
    if (action === 'movimentação' || stats === 'recolhido') {
      return 'recolha';
    } else if (action === 'entrega' || stats === 'entregue') {
      return 'entrega';
    } else if (action === 'cancelamento' || stats === 'cancelado') {
      return 'cancelamento';
    } else {
      return 'reserva';
    }
  },
  
  // Filtrar registos por tipo
  filterByType: (records, type) => {
    return records.filter(record => {
      const recordType = FirebaseUtils.getRecordType(record);
      return recordType === type;
    });
  }
};

export default {
  FIREBASE_COLLECTIONS,
  RESERVAS_FIELDS,
  ENTREGAS_FIELDS,
  FILTER_OPTIONS,
  FirebaseUtils
};
