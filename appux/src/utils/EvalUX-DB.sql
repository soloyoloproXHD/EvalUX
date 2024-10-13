-- Crear nuevas tablas para autenticación
CREATE TABLE verification_token (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts (
  id SERIAL,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE sessions (
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  "nombres" VARCHAR(30),
  "apellidos" VARCHAR(30),
  "correoE" VARCHAR(30),
  "contrasena" VARCHAR(100),
  "fecha_registro" DATE,
  PRIMARY KEY (id)
);

-- Crear tablas existentes ajustadas
CREATE TABLE "rubrica" (
  "id" serial PRIMARY KEY,
  "nombre" varchar(30),
  "ruta_rubrica" varchar(100),
  "usuario_id" int
);

CREATE TABLE "princ_rub" (
  "id" serial PRIMARY KEY,
  "rubrica_id" int,
  "principio_id" int
);

CREATE TABLE "principio" (
  "id" serial PRIMARY KEY,
  "contenido" varchar(50)
);

CREATE TABLE "categoria" (
  "id" serial PRIMARY KEY,
  "contenido" varchar(550),
  "principio_id" int
);

CREATE TABLE "ecenario" (
  "id" serial PRIMARY KEY,
  "contenido" varchar(550),
  "puntaje" int,
  "categoria_id" int
);

CREATE TABLE "incognita" (
  "id" serial PRIMARY KEY,
  "pregunta" varchar(550),
  "categoria_id" int
);

-- Ajustar llaves foráneas
ALTER TABLE "rubrica" ADD FOREIGN KEY ("usuario_id") REFERENCES "users" ("id");

ALTER TABLE "princ_rub" ADD FOREIGN KEY ("rubrica_id") REFERENCES "rubrica" ("id");

ALTER TABLE "princ_rub" ADD FOREIGN KEY ("principio_id") REFERENCES "principio" ("id");

ALTER TABLE "categoria" ADD FOREIGN KEY ("principio_id") REFERENCES "principio" ("id");

ALTER TABLE "ecenario" ADD FOREIGN KEY ("categoria_id") REFERENCES "categoria" ("id");

ALTER TABLE "incognita" ADD FOREIGN KEY ("categoria_id") REFERENCES "categoria" ("id");

-- Agregar llaves foráneas para nuevas tablas
ALTER TABLE accounts ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE sessions ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

/*INSERTS DE LOS PRINCIPIOS UX*/ 
INSERT INTO principio (contenido) VALUES ('Usabilidad');
INSERT INTO principio (contenido) VALUES ('Accesibilidad');
INSERT INTO principio (contenido) VALUES ('Simplicidad');
INSERT INTO principio (contenido) VALUES ('Concistencia');
INSERT INTO principio (contenido) VALUES ('Centrado en el Usuario');

/*INSERTS DE LAS CATEGORIAS PARA CADA PRINCIPIO*/
/*Usabilidad (1)*/
INSERT INTO categoria (contenido, principio_id) VALUES ('SATISFACCIÓN DEL USUARIO',1);
INSERT INTO categoria (contenido, principio_id) VALUES ('EFICIENCIA EN LA REALIZACIÓN DE TAREAS',1);
INSERT INTO categoria (contenido, principio_id) VALUES ('CLARIDAD DE LA INTERFAZ',1);
INSERT INTO categoria (contenido, principio_id) VALUES ('FACILIDAD DE APRENDIZAJE',1);
/*Accesibilidad (2)*/
INSERT INTO categoria (contenido, principio_id) VALUES ('PERCEPTIBLE',2);
INSERT INTO categoria (contenido, principio_id) VALUES ('OPERABLE',2);
INSERT INTO categoria (contenido, principio_id) VALUES ('COMPRENSIBLE',2);
INSERT INTO categoria (contenido, principio_id) VALUES ('ROBUSTO',2);
/*Simplicidad (3)*/
INSERT INTO categoria (contenido, principio_id) VALUES ('REDUCCIÓN DE COMPLEJIDAD',3);
INSERT INTO categoria (contenido, principio_id) VALUES ('CLARIDAD DE LA INTERFAZ',3);
INSERT INTO categoria (contenido, principio_id) VALUES ('CLARIDAD DE LA DOCUMENTACIÓN',3);
INSERT INTO categoria (contenido, principio_id) VALUES ('MINIMALISMO DE LA INTERFAZ',3);
INSERT INTO categoria (contenido, principio_id) VALUES ('DESEMPEÑO',3);
/*Consistencia (4)*/
INSERT INTO categoria (contenido, principio_id) VALUES ('CONSISTENCIA VISUAL',4);
INSERT INTO categoria (contenido, principio_id) VALUES ('CONSISTENCIA FUNCIONAL',4);
INSERT INTO categoria (contenido, principio_id) VALUES ('CONSISTENCIA DE NAVEGACIÓN',4);
INSERT INTO categoria (contenido, principio_id) VALUES ('CONSISTENCIA DE CONTENIDO',4);
INSERT INTO categoria (contenido, principio_id) VALUES ('CONSISTENCIA DE RETROALIMENTACIÓN DEL SISTEMA',4);
INSERT INTO categoria (contenido, principio_id) VALUES ('CONSISTENCIA DE FLUJO DE TRABAJO',4);
/*Centrado en el Usuario (5)*/
INSERT INTO categoria (contenido, principio_id) VALUES ('COMPRENSIÓN DE LAS NECESIDADES DEL USUARIO',5);
INSERT INTO categoria (contenido, principio_id) VALUES ('EMPATÍA CON EL USUARIO',5);
INSERT INTO categoria (contenido, principio_id) VALUES ('SEGURIDAD',5);
INSERT INTO categoria (contenido, principio_id) VALUES ('INVESTIGACIÓN Y PRUEBAS DE USUARIO',5);

/*INSERTS de escenarios para cada categoria existente*/
/*Usabilidad*/
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Los usuarios están frustrados y descontentos con la experiencia general. La interfaz es confusa o incómoda.',1,1);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La satisfacción es baja, los usuarios experimentan dificultades menores, pero son frecuentes.',2,1);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La mayoría de los usuarios están satisfechos, aunque hay áreas de mejora.',3,1);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Satisfacción alta en casi todos los aspectos.',4,1);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Los usuarios están completamente satisfechos con la experiencia, sin problemas reportados.',5,1);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las tareas son muy difíciles de completar, requieren múltiples intentos y mucho tiempo.',1,2);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Los usuarios completan las tareas con lentitud debido a obstáculos menores pero persistentes.',2,2);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La mayoría de las tareas se completan de manera eficiente, aunque algunas son más lentas.',3,2);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las tareas se completan rápidamente, con ligeros retrasos ocasionales.',4,2);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las tareas se realizan con extrema rapidez y sin esfuerzo.',5,2);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La interfaz es confusa, con elementos que no tienen una estructura o disposición lógica.',1,3);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Algunas partes de la interfaz son claras, pero otras generan confusión.',2,3);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La interfaz es generalmente clara, pero puede haber momentos de ambigüedad.',3,3);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La interfaz es mayormente intuitiva y fácil de entender.',4,3);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La interfaz es completamente clara y comprensible, los usuarios entienden todo sin problemas.',5,3);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Muy difícil de aprender, los nuevos usuarios se sienten abrumados y necesitan mucha ayuda.',1,4); 
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Existen barreras de aprendizaje significativas, pero se puede aprender con tiempo y práctica.',2,4);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Los nuevos usuarios aprenden el sistema de manera razonablemente rápida, con algunas dificultades iniciales.',3,4);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La mayoría de los nuevos usuarios pueden aprender fácilmente el sistema.',4,4);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Extremadamente fácil de aprender, los usuarios nuevos se familiarizan con el sistema inmediatamente.',5,4);

/*Accesibilidad*/
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('No se proporcionan alternativas.',1,5);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Algunas imágenes tienen alternativas, pero están incompletas o inexactas.',2,5);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las principales imágenes tienen texto alternativo, pero faltan algunas descripciones.',3,5);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La mayoría de las imágenes tienen texto alternativo adecuado, pero algunas no son completamente precisas.',4,5);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Todas las imágenes, íconos y gráficos tienen alternativas textuales precisas y detalladas.',5,5);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Ninguna funcionalidad es accesible mediante teclado.',1,6);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Algunas funcionalidades son accesibles mediante teclado, pero otras no responden adecuadamente.',2,6);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las funciones principales del sistema son accesibles mediante teclado, pero algunas tareas secundarias no.',3,6);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La mayoría de las funcionalidades son accesibles mediante teclado, pero algunas interacciones avanzadas son difíciles de realizar.',4,6);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Todo el sistema es completamente accesible mediante el teclado, sin necesidad de mouse.',5,6);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El lenguaje es técnico y difícil de entender.',1,7);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Algunas instrucciones son claras, pero otras contienen jerga técnica o ambigua.',2,7);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La mayoría del lenguaje es claro, pero hay partes que requieren mejoras.',3,7);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El lenguaje es mayormente claro y sencillo, con solo algunas áreas confusas.',4,7);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El lenguaje es completamente claro, simple y fácil de entender para todos los usuarios.',5,7);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('No se adapta a diferentes dispositivos o tecnologías.',1,8);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El sistema es difícil de usar en algunos dispositivos o se rompe en pantallas más pequeñas.',2,8);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El sistema es funcional en la mayoría de los dispositivos, pero carece de adaptabilidad en ciertas tecnologías.',3,8);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El sistema se adapta bien a la mayoría de los dispositivos, con algunos pequeños problemas en tecnologías más nuevas.',4,8);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El sistema es completamente adaptable a cualquier dispositivo y tecnología futura.',5,8);

/*Simplicidad*/
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El software está sobrecargado con funciones innecesarias que dificultan su uso.',1,9);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El software tiene funciones adicionales que pueden complicar su uso para usuarios inexpertos.',2,9);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El software incluye varias características adicionales que pueden complicar su uso, especialmente para usuarios inexpertos.',3,9);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El software elimina la mayoría de las características innecesarias, pero tiene algunas adicionales que no afectan mucho la simplicidad',4,9);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El software elimina funciones o características innecesarias, centrándose en lo esencial para su propósito',5,9);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La interfaz es compleja y difícil de entender, con muchos elementos innecesarios.',1,10);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Algunas partes son claras, pero otras son confusas y con elementos innecesarios.',2,10);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La mayoría de la interfaz es clara, pero algunos elementos podrían simplificarse.',3,10);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La interfaz es casi totalmente clara y sencilla.',4,10);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Completamente clara, sin elementos innecesarios ni distracciones.',5,10);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La documentación es inadecuada, confusa o inexistente, dificultando la resolución de problemas.',1,11);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La documentación es útil, pero puede ser confusa o demasiado técnica para algunos usuarios.',2,11);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La documentación es mayormente clara, pero podría beneficiarse de más ejemplos o explicaciones detalladas.',3,11);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La documentación es clara y útil, con solo pequeñas áreas que podrían beneficiarse de mayor detalle.',4,11);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La documentación es clara, concisa y fácil de entender, lo que ayuda a los usuarios a resolver problemas rápidamente.',5,11);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Sobreabundancia de información innecesaria, lo que dificulta la interacción.',1,12);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Algunas áreas muestran demasiada información.',2,12);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La mayoría de las pantallas son simples, pero algunas podrían eliminar elementos superfluos.',3,12);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Casi siempre se muestra solo lo esencial.',4,12);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Todos los elementos innecesarios han sido eliminados, manteniendo un diseño limpio y simple.',5,12);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Respuesta lenta y demoras constantes, lo que afecta la simplicidad del uso.',1,13);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El rendimiento es aceptable, pero hay algunas demoras notables.',2,13);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La mayoría de las tareas se realizan sin demoras, pero existen algunas áreas donde la velocidad puede mejorar.',3,13);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El rendimiento es rápido y eficiente en casi todo el sistema.',4,13);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Sin demoras, el sistema responde de inmediato a las interacciones del usuario.',5,13);

/*Concistencia*/
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El software no es consistente en diseño ni estilo en ninguna parte de la aplicación.',1,14);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El software posee variaciones significativas con diferentes estilos y diseños en toda la aplicación.',2,14);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Existen variaciones notables en colores o iconos en diferentes partes del software.',3,14);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Hay una consistencia mayoritaria, con ligeras variaciones en algunos elementos.',4,14);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El software usa de manera consistente colores, iconos y espacios en todas las pantallas.',5,14);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las funciones no cuentan con coherencia alguna en el sistema.',1,15);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las funciones son altamente inconsistentes, generando confusión y errores frecuentes.',2,15);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Varias funciones se comportan de manera inconsistente, causando confusión ocasional.',3,15);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las funciones son mayormente consistentes, con ligeras variaciones que no afectan gravemente la experiencia.',4,15);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Todas las funciones (botones, formularios, interacciones) operan de manera uniforme y predecible en todo el sistema.',5,15);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La navegación confusa e inconsistente.',1,16);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La navegación es inconsistente, con elementos clave colocados en lugares inesperados.',2,16);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Existen variaciones en la estructura de navegación que pueden confundir al usuario.',3,16);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La navegación es consistente, pero existen pequeñas diferencias en la ubicación o funcionamiento de elementos.',4,16);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La estructura de navegación es clara en todo el software, los menús, botones y enlaces están ubicados en lugares predecibles en todas las pantallas.',5,16);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El contenido esta desorganizado, lo cual hace que sea difícil utilizar el software. ',1,17);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El contenido carece de coherencia, con grandes variaciones en tono, estilo o formato, lo que afecta negativamente la experiencia del usuario.',2,17);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Existen inconsistencias notables en el tono, estilo o formato del contenido, lo que podría distraer o confundir al usuario.',3,17);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El contenido es mayormente consistente, posee pequeñas diferencias en el tono o formato que no afectan gravemente la coherencia.',4,17);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El contenido es consistente en estilo, tono, formato y calidad en todo el software; los textos son claros, las imágenes relevantes y coherentes.',5,17);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La retroalimentación que brinda el sistema es confusa o está ausente.',1,18);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El sistema es incoherente con la retroalimentación, los mensajes, alertas o confirmaciones cambian drásticamente.',2,18);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Existen mensajes o alertas que varían de una sección a otra.',3,18);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El software es consistente en su mayoría, aunque algunas áreas tienen mensajes o alertas ligeramente diferentes.',4,18);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El software proporciona mensajes, alertas y confirmaciones similares en todas las áreas.',5,18);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El flujo de trabajo no es consistente y es complicado de usar.',1,19);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El flujo de trabajo es confuso y no sigue un orden lógico, dificultando la navegación del usuario.',2,19);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El flujo de trabajo tiene un orden general, pero hay inconsistencias que pueden generar confusión.',3,19);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El flujo de trabajo es generalmente claro y lógico, aunque podría mejorarse en algunas áreas.',4,19);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El flujo de trabajo es claro, lógico y permite al usuario navegar de manera fluida y eficiente.',5,19);

/*Centrado en el Usuario*/
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El sistema no toma en cuenta las necesidades del usuario.',1,20);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Solo algunas áreas abordan las necesidades del usuario, pero falta alineación en otras.',2,20);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las necesidades están mayormente atendidas, pero existen áreas donde podrían mejorar.',3,20);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las necesidades del usuario son entendidas y abordadas en casi todas las áreas.',4,20);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El producto está completamente alineado con las necesidades del usuario.',5,20);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('No se considera el contexto o emociones del usuario.',1,21);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Algunas áreas muestran empatía, pero otras no toman en cuenta el contexto del usuario.',2,21);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Mayormente empático, pero hay algunas áreas donde falta anticipación de necesidades.',3,21);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Altamente empático, anticipando la mayoría de las necesidades del usuario.',4,21);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El diseño anticipa con precisión todas las necesidades y emociones del usuario.',5,21);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('No hay protección visible de datos, y la privacidad del usuario es descuidada.',1,22);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('La seguridad es mínima, y el usuario podría sentirse expuesto.',2,22);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las medidas de seguridad básicas están implementadas, pero falta claridad en las políticas de privacidad.',3,22);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Buenas prácticas de seguridad, los usuarios sienten que sus datos están protegidos.',4,22);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('El software implementa medidas de seguridad robustas y actualizadas, protegiendo la información del usuario y garantizando un uso seguro en todo momento.',5,22);

INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('No se realizaron investigaciones ni pruebas de usuario.',1,23);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Se realizaron investigaciones mínimas o pruebas poco frecuentes.',2,23);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las pruebas de usuario se realizan regularmente, aunque no de manera exhaustiva.',3,23);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Las pruebas de usuario son frecuentes y efectivas en la mayoría de los casos.',4,23);
INSERT INTO ecenario (contenido, puntaje, categoria_id) VALUES ('Investigación constante, con pruebas de usabilidad en cada iteración del diseño.',5,23);

/*INSERTS DE INCOGNITAS DE EVALUACIÓN*/
/*Usabilidad*/
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Qué tan satisfechos están los usuarios con la experiencia general al usar el sistema?', 1);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Los usuarios pueden completar sus tareas de manera rápida y sin confusión? ¿El software minimiza los pasos necesarios para realizar acciones comunes?', 2);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿La interfaz del software es clara y libre de desorden?¿Los elementos visuales están organizados de manera lógica?', 3);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Los nuevos usuarios pueden aprender a usar el software rápidamente sin necesidad de mucha ayuda o capacitación?', 4);

/*Accesibilidad*/
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Se proporciona texto alternativo en todas las imágenes o elementos visuales?¿Los usuarios con discapacidades visuales pueden comprender el contenido?', 5);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Se puede navegar completamente por el sistema utilizando solo el teclado?¿Las acciones más comunes son accesibles sin el uso del mouse?¿Los usuarios con limitaciones motoras pueden interactuar sin dificultad?', 6);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿El lenguaje y las instrucciones son fáciles de entender para todos los usuarios? ¿Hay jerga técnica que pueda confundir a los usuarios?', 7);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿El sistema es accesible en dispositivos móviles y tabletas? ¿Es adaptable a tecnologías futuras o emergentes?', 8);
 
/*Simplicidad*/
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿El software está enfocado en lo esencial, eliminando funciones innecesarias? ¿Las funciones adicionales del software complican su uso? ¿El software está sobrecargado con funciones que dificultan su manejo?', 9);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿La interfaz es fácil de entender a primera vista, sin elementos innecesarios que distraigan al usuario?', 10);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿La documentación proporciona explicaciones claras y comprensibles para los usuarios? ¿Hay suficientes ejemplos y detalles en la documentación para ayudar a resolver problemas? ¿La documentación es útil y fácil de entender o requiere mucho esfuerzo para encontrar la información necesaria?', 11);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Se evita la sobrecarga de información, mostrando solo los elementos esenciales para la tarea del usuario?', 12);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿El sistema responde rápidamente y sin demoras, eliminando tiempos de espera innecesarios para realizar las tareas?', 13);

/*Consistencia*/
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Se mantiene un esquema de colores uniforme en todos los elementos y pantallas del producto?, ¿Los estilos de tipografía (fuentes, tamaños, pesos) son coherentes en todo el diseño?, ¿Los iconos siguen un estilo y significado consistentes en toda la aplicación?, ¿El espaciado, márgenes y alineaciones son uniformes y organizados en todas las secciones?', 14);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Las acciones de los botones y elementos interactivos son coherentes en todas las pantallas?¿Las funciones similares están implementadas de manera idéntica en diferentes partes de la aplicación?¿Los patrones de interacción (como arrastrar, soltar, clics) son los mismos en diferentes secciones?', 15);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Los elementos de navegación están ubicados en las mismas posiciones y funcionan de manera coherente en todas las pantallas?¿Los menús y rutas de navegación siguen un patrón predecible y uniforme?¿El acceso a las diferentes funciones del sistema es consistente en todas las secciones?', 16);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿El tono y lenguaje utilizado en el contenido es coherente en todas las secciones del producto?¿Las etiquetas y terminología son uniformes en todas las funciones y áreas de la aplicación?¿El formato y estructura del contenido se mantienen consistentes en diferentes partes del producto?', 17);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Los mensajes de error, alertas y notificaciones siguen un formato y estilo coherente en todo el sistema?¿Las animaciones y transiciones son consistentes y previsibles en diferentes interacciones?¿El tipo de retroalimentación proporcionada al usuario (visual, sonora, textual) es uniforme en todo el sistema?', 18);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Las tareas similares siguen los mismos pasos y patrones de flujo en diferentes secciones de la aplicación?¿El proceso de completar una acción (como un formulario o una compra) es coherente y predecible en todo el sistema?', 19);

/*Centrado en el usuario*/
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿El sistema o producto responde claramente a las necesidades, expectativas y problemas específicos de los usuarios?', 20);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿El diseño muestra una comprensión profunda de los contextos y emociones del usuario, anticipando sus necesidades antes de que las expresen?', 21);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿El software implementa medidas de seguridad actualizadas y efectivas?¿Se protege la información del usuario? ¿El sistema protege los datos del usuario y ofrece garantías de privacidad, cumpliendo con estándares de seguridad?', 22);
INSERT INTO incognita (pregunta, categoria_id) VALUES ('¿Se ha realizado investigación de usuarios y se utilizan pruebas de usabilidad para mejorar continuamente el diseño?', 23);