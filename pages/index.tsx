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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import * as yup from "yup";

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
    const request: ISolicitaCertificado = {
      email,
      name,
    };

    const schema = yup.object().shape({
      name: yup.string().required().max(30).min(3),
      email: yup.string().email().required().max(30),
    });

    const validate = await schema.isValid(request);
    if (!validate) {
      toast({
        position: "top",
        title: "Ops, erro na validação.",
        description: "Verifique os campos e tente novamente.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const resp = await axios.post("/api/lambda_certificate", {
        ...request,
        token: token,
      });

      resp.status === 201 &&
        toast({
          position: "top",
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
        position: "top",
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
        w={400}
        p={8}
        m={4}
        rounded={6}
        border={"1px"}
        background={"white"}
      >
        <FormControl onSubmit={handleSubmit} isRequired>
          <Heading mb={2}>Solicitar certificado</Heading>
          <Text fontSize={"md"} mb={6}>
            Post sobre arquitetura serverless
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
            <Popover>
              <PopoverTrigger>
                <Text fontSize={"smaller"}>
                  Ao clicar em enviar, você estará concordando com os{" "}
                  <Link color={"#319795"}>termos de uso</Link>.
                </Text>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader>Termos de uso</PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Text fontSize={"smaller"} textAlign={"justify"}>
                      Atenção! <br />
                      Ao submeter este formulário, você concorda em compartilhar
                      seu endereço de e-mail para recebimento do link do
                      certificado de visualização deste projeto, com caráter
                      unicamente educativo.
                    </Text>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
            {name && email && (
              <ReCAPTCHA
                style={{ marginTop: "1rem" }}
                sitekey={process.env.REACT_APP_SITE_KEY as string}
                ref={captchaRef}
                onChange={handleCaptcha}
                onExpired={() => setToken(null)}
              />
            )}
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
