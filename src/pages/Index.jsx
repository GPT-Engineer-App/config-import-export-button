import React, { useState } from "react";
import { Box, Button, Checkbox, Heading, Select, Stack, Text, Textarea, VStack } from "@chakra-ui/react";

const orgaos = ["Crânio", "Seios da face", "Órbitas", "Ouvidos", "Faringe", "Laringe", "Tireoide", "Coluna cervical"];

const alteracoesCranio = ["Redução volumétrica encefálica", "Calcificações vasculares", "Distensão de alças", "Coleções extra-axiais"];

const Index = () => {
  const [exame, setExame] = useState("");
  const [achados, setAchados] = useState({});
  const [texto, setTexto] = useState("");

  const handleExameChange = (event) => {
    setExame(event.target.value);
  };

  const handleAchadoChange = (orgao, alteracao) => {
    setAchados((prevAchados) => ({
      ...prevAchados,
      [orgao]: {
        ...prevAchados[orgao],
        [alteracao]: !prevAchados[orgao]?.[alteracao],
      },
    }));
  };

  const handleLimparTexto = () => {
    setTexto("");
  };

  const handleAdicionarAchados = () => {
    let novoTexto = "";

    for (const orgao in achados) {
      const alteracoesOrgao = Object.entries(achados[orgao])
        .filter(([, selecionado]) => selecionado)
        .map(([alteracao]) => alteracao);

      if (alteracoesOrgao.length > 0) {
        novoTexto += `${orgao}: ${alteracoesOrgao.join(", ")}\n`;
      }
    }

    setTexto(novoTexto);
  };

  const handleImportarConfiguracoes = () => {
    const configuracoes = prompt("Cole as configurações JSON:");
    if (configuracoes) {
      try {
        const parsedConfig = JSON.parse(configuracoes);
        setExame(parsedConfig.exame || "");
        setAchados(parsedConfig.achados || {});
        setTexto(parsedConfig.texto || "");
      } catch (error) {
        alert("Configurações inválidas!");
      }
    }
  };

  const handleExportarConfiguracoes = () => {
    const configuracoes = {
      exame,
      achados,
      texto,
    };
    const jsonConfig = JSON.stringify(configuracoes);
    navigator.clipboard.writeText(jsonConfig).then(
      () => {
        alert("Configurações copiadas para a área de transferência!");
      },
      (err) => {
        console.error("Erro ao copiar configurações: ", err);
      },
    );
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading>Laudo Radiológico</Heading>
        <Select value={exame} onChange={handleExameChange}>
          <option value="">Selecione o exame</option>
          <option value="TC Crânio sem contraste">TC Crânio sem contraste</option>
          <option value="TC Crânio com contraste">TC Crânio com contraste</option>
        </Select>
        <Stack direction={["column", "row"]} spacing={4}>
          {orgaos.map((orgao) => (
            <Box key={orgao}>
              <Heading size="md">{orgao}</Heading>
              {orgao === "Crânio" && (
                <Stack pl={4}>
                  {alteracoesCranio.map((alteracao) => (
                    <Checkbox key={alteracao} isChecked={achados[orgao]?.[alteracao] || false} onChange={() => handleAchadoChange(orgao, alteracao)}>
                      {alteracao}
                    </Checkbox>
                  ))}
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
        <Textarea value={texto} readOnly height="200px" />
        <Stack direction={["column", "row"]} spacing={4}>
          <Button onClick={handleLimparTexto}>Limpar texto</Button>
          <Button onClick={handleAdicionarAchados}>Adicionar achados</Button>
          <Button onClick={handleImportarConfiguracoes}>Importar configurações</Button>
          <Button onClick={handleExportarConfiguracoes}>Exportar configurações</Button>
        </Stack>
      </VStack>
    </Box>
  );
};

export default Index;
