import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  Spinner,
  Spacer,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

type ISolicitaCertificado = {
  name: string;
  email: string;
};

export default function Home() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const toast = useToast();

  const captchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async () => {
    if (!name || !email) {
      toast({
        position: "top-left",
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

    try {
      setLoading(true);
      const resp = await axios.post("/api/lambda_certificate", {
        ...request,
        token: token,
      });

      resp.status === 201 &&
        toast({
          position: "top-left",
          title: "Solicitação enviada.",
          description: "Tudo certo! Verifique seu e-mail e caixa de spam.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      handleCleanForm();
      captchaRef.current && captchaRef.current.reset();
    } catch (error) {
      console.log(error);
      toast({
        position: "top-left",
        title: "Ops, ocorreu algum erro.",
        description: "Verifique os campos e tente novamente.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCleanForm = () => {
    setName("");
    setEmail("");
    setToken(null);
  };

  const handleCaptcha = () => {
    if (captchaRef.current !== null) {
      const token = captchaRef.current.getValue();
      token && setToken(token);
    }
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
        p={8}
        m={4}
        rounded={6}
        border={"1px"}
        background={"white"}
      >
        <FormControl onSubmit={handleSubmit}>
          <Heading mb={2}>Solicitar certificado</Heading>
          <Text fontSize={"md"} mb={6}>
            Certificado de visualização de post sobre serverless
          </Text>
          <FormLabel>Seu nome:</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            mb={4}
            type={"text"}
            placeholder="nome completo..."
          />
          <FormLabel>Seu email:</FormLabel>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb={4}
            type={"email"}
            placeholder="email@email.com"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Text fontSize={"smaller"} w={300} textAlign={"justify"}>
              Atenção, ao submeter formulário, você concorda em compartilhar seu
              endereço de e-mail apenas para recebimento do link do certificado
              de visualização deste projeto com caráter unicamente educativo.
            </Text>
            <ReCAPTCHA
              style={{ marginTop: "1rem" }}
              sitekey={process.env.REACT_APP_SITE_KEY as string}
              ref={captchaRef}
              onChange={handleCaptcha}
            />
          </Flex>
          <Flex>
            <Button
              mt={4}
              colorScheme={"teal"}
              onClick={handleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={!!loading || token === null}
              width={"100%"}
            >
              Enviar
            </Button>
            {loading && (
              <>
                <Spacer />
                <Spinner mt={5} ml={1} color={"#319795"} />
              </>
            )}
          </Flex>
        </FormControl>

        <Text mt={5}>
          Designed by{" "}
          <Link href="https://github.com/thuurzz" color={"#319795"} isExternal>
            @thuurrzz
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
}
