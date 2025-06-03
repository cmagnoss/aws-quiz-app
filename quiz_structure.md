## Estrutura do Quiz AWS Certified AI Practitioner (AIF-C01)

Este documento descreve a estrutura e o formato das perguntas para o aplicativo de quiz baseado no guia do exame AWS Certified AI Practitioner (AIF-C01).

### 1. Formato das Perguntas

Para garantir a viabilidade e clareza do quiz neste formato, as perguntas serão predominantemente do tipo **Múltipla Escolha**. Cada pergunta terá:

*   Um enunciado claro e conciso, abordando um tópico específico de um dos domínios do exame.
*   Quatro (4) opções de resposta, sendo apenas uma correta e três incorretas (distratores).
*   Indicação da resposta correta para fins de correção.
*   Identificação do domínio ao qual a pergunta pertence para cálculo da pontuação final por domínio.

*Observação:* O guia oficial menciona outros tipos de perguntas (múltipla resposta, ordenação, correspondência, estudo de caso). No entanto, para esta implementação inicial, focaremos no formato de múltipla escolha.

### 2. Domínios e Distribuição Percentual

As perguntas serão distribuídas entre os cinco domínios do exame, respeitando as ponderações oficiais:

*   **Domínio 1:** Fundamentos de IA e ML (20%)
*   **Domínio 2:** Fundamentos de IA generativa (24%)
*   **Domínio 3:** Aplicações de modelos de base (28%)
*   **Domínio 4:** Diretrizes de IA responsável (14%)
*   **Domínio 5:** Segurança, conformidade e governança para soluções de IA (14%)

### 3. Cálculo da Quantidade de Perguntas por Domínio

Quando o usuário escolher o número total de perguntas para o quiz, a quantidade de perguntas para cada domínio será calculada aplicando-se os percentuais acima. O resultado será arredondado para o número inteiro mais próximo, garantindo que a soma total corresponda à escolha do usuário.

**Exemplo (para um quiz de 30 perguntas):**

*   Domínio 1: 30 * 0.20 = 6 perguntas
*   Domínio 2: 30 * 0.24 = 7.2 ≈ 7 perguntas
*   Domínio 3: 30 * 0.28 = 8.4 ≈ 8 perguntas
*   Domínio 4: 30 * 0.14 = 4.2 ≈ 4 perguntas
*   Domínio 5: 30 * 0.14 = 4.2 ≈ 4 perguntas
*   **Total:** 6 + 7 + 8 + 4 + 4 = 29 perguntas. (Ajustes finos podem ser necessários para totalizar exatamente 30, por exemplo, adicionando a pergunta restante ao domínio com maior fração decimal ou maior peso).

### 4. Funcionalidades do Quiz

*   O usuário define o número de perguntas.
*   As perguntas são apresentadas uma a uma.
*   A correção é feita imediatamente após cada resposta do usuário.
*   Ao final, o resultado geral (percentual de acertos) e o desempenho por domínio (percentual de acertos em cada domínio) são exibidos.

