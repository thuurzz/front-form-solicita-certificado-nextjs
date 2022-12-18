import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

type ISolicitaCertificado = {
  nome: string;
  email: string;
};

export default function Home() {
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = () => {
    if (nome && email) {
      const request: ISolicitaCertificado = {
        email,
        nome,
      };
      console.log(request);
    }
    handleCleanForm();
  };

  const handleCleanForm = () => {
    setNome("");
    setEmail("");
  };

  return (
    <Flex
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
      background={"whitesmoke"}
    >
      <Flex
        direction={"column"}
        p={12}
        rounded={6}
        border={"1px"}
        background={"white"}
      >
        <FormControl>
          <Heading mb={2}>Solicitar certificado</Heading>
          <Text fontSize={"md"} mb={6}>
            Certificado de visualização de post
          </Text>
          <FormLabel>Seu nome:</FormLabel>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            mb={4}
            type={"text"}
            placeholder="Arthur Vinicius ..."
          />
          <FormLabel>Seu email:</FormLabel>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb={4}
            type={"email"}
            placeholder="email@email.com"
          />
          <Button mt={4} colorScheme={"teal"} onClick={handleSubmit}>
            Enviar
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
}
