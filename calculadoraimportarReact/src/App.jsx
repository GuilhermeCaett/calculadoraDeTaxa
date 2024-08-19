import './global.css';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function App() {
  const [cotacao, setCotacao] = useState(0);
  const [estado, setEstado] = useState(""); // Armazena o estado selecionado

  async function fetchCotacao() {
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
      const data = await response.json();
      setCotacao(parseFloat(data.USDBRL.bid));
      console.log(`Cotação atual do Dólar: R$ ${cotacao.toFixed(2)}`);
    } catch (error) {
      document.getElementById('cotacao').innerText = 'Erro ao carregar a cotação';
      console.error('Erro ao buscar a cotação:', error);
    }
  }

  fetchCotacao();
  setInterval(fetchCotacao, 30000);

  function calcularTaxa() {
    const declaracao = document.getElementById('valor').value;

    let icms = 18;
    switch (estado) {
      case "SP":
        icms = 18;
        break;
      case "RJ":
        icms = 20;
        break;
      case "MG":
      case "RS":
      case "PR":
      case "BA":
      case "PE":
      case "CE":
      case "MA":
        icms = 18;
        break;
      case "ES":
      case "SC":
      case "GO":
        icms = 17;
        break;
      default:
        icms = 18;
        break;
    }

    const valorReais = declaracao * cotacao;
    const taxaImportacao = 60;
    const valorTaxaImportacao = valorReais * (taxaImportacao / 100);
    const valorICMS = valorReais * (icms / 100);
    const valorTotal = valorTaxaImportacao + valorICMS;

    document.getElementById('taxa').innerText = 'Você será taxado cerca de: R$ ' + valorTotal.toFixed(2);
    document.getElementById('aviso').innerText = 'Aviso: O valor é estimado. A cotação do dólar no momento da taxação pode variar.';
  }

  const handleSelectOpenChange = (open) => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <CardHeader className="mb-4 text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Calculadora de Taxa de Importação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="valor" className="block text-gray-700">
              Valor Declarado
            </Label>
            <Input
              id="valor"
              type="number"
              placeholder="Valor em dólar"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="estado" className="block text-gray-700">
              Selecione seu estado
            </Label>
            <Select onOpenChange={handleSelectOpenChange} onValueChange={setEstado}>
              <SelectTrigger
                id="estado"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <SelectValue placeholder="Escolha seu estado" />
              </SelectTrigger>
              <SelectContent portalled={true} position="popper">
                <SelectItem value="AC">Acre</SelectItem>
                <SelectItem value="AL">Alagoas</SelectItem>
                <SelectItem value="AP">Amapá</SelectItem>
                <SelectItem value="AM">Amazonas</SelectItem>
                <SelectItem value="BA">Bahia</SelectItem>
                <SelectItem value="CE">Ceará</SelectItem>
                <SelectItem value="DF">Distrito Federal</SelectItem>
                <SelectItem value="ES">Espírito Santo</SelectItem>
                <SelectItem value="GO">Goiás</SelectItem>
                <SelectItem value="MA">Maranhão</SelectItem>
                <SelectItem value="MT">Mato Grosso</SelectItem>
                <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
                <SelectItem value="PA">Pará</SelectItem>
                <SelectItem value="PB">Paraíba</SelectItem>
                <SelectItem value="PR">Paraná</SelectItem>
                <SelectItem value="PE">Pernambuco</SelectItem>
                <SelectItem value="PI">Piauí</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                <SelectItem value="RO">Rondônia</SelectItem>
                <SelectItem value="RR">Roraima</SelectItem>
                <SelectItem value="SC">Santa Catarina</SelectItem>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="SE">Sergipe</SelectItem>
                <SelectItem value="TO">Tocantins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={calcularTaxa} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-md shadow-md transition duration-200">
            Calcular
          </Button>
          <p id="taxa" className="mt-4 text-lg text-gray-800"></p>
          <p id="aviso" className="mt-2 text-sm text-gray-600"></p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
