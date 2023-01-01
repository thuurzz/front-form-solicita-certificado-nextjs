import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

type ISolicitaCertificado = {
  name: string;
  email: string;
};

export default function Home() {
  const [name, setname] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const toast = useToast();

  const handleSubmit = async () => {
    if (!name || !email) {
      toast({
        position: "top",
        title: "Campos em branco.",
        description: "Verifique os campos e tente novamente.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const request: ISolicitaCertificado = {
      email,
      name,
    };

    const resp = await axios.post("/api/lambda_certificate", request);

    console.log(resp);

    resp.status === 201
      ? toast({
          position: "top",
          title: "Solicitação enviada.",
          description:
            "Tudo certo, em alguns instantes verifique seu e-mail, inclusive a caixa de spam.",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      : toast({
          position: "top",
          title: "Ops, ocorreu algum erro.",
          description: "Verifique os campos e tente novamente.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });

    handleCleanForm();
  };

  const handleCleanForm = () => {
    setname("");
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
          <FormLabel>Seu name:</FormLabel>
          <Input
            value={name}
            onChange={(e) => setname(e.target.value)}
            mb={4}
            type={"text"}
            placeholder="name Sobrename..."
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
