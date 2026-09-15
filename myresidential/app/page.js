import Image from "next/image";
export default function Home() {
  return (
    <main>
      <header className="navbar">
        <a href="/" className="brandLogo">
        <Image
          src="/logo-myresidential.png"
          alt="MyResidential"
          width={42}
          height={42}
          className="brandLogoImage"
        />
        <span>MyResidential</span>
      </a>

        <nav className="navLinks">
          <a href="#problema">Problema</a>
          <a href="#modelo-datos">Datos</a>
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#administrador">Administrador</a>
          <a href="#vecino">Vecino</a>
        </nav>

        <a className="navButton" href="#demo">
          Ver demo
        </a>
      </header>

      <section className="hero">
        <div className="heroContent">
          <p className="eyebrow">PropTech para comunidades residenciales</p>

          <h1>
            Gestiona comunidades
            <span> con datos, no con intuición.</span>
          </h1>

          <p className="heroText">
            Centraliza gastos, proveedores, contratos e incidencias.
            Detecta desviaciones y compara comunidades similares para
            tomar mejores decisiones.
          </p>

          <div className="heroAccess">
          <a
            href="/administrador/login"
            className="heroAccessCard heroAccessAdmin"
          >
            <span className="heroAccessLabel">GESTIÓN PROFESIONAL</span>
            <strong>Soy Administrador</strong>
            <p>
              Gestiona comunidades, analiza gastos y detecta desviaciones.
            </p>
            <span className="heroAccessArrow">Acceder →</span>
          </a>

          <a
            href="/vecino/login"
            className="heroAccessCard heroAccessNeighbor"
          >
            <span className="heroAccessLabel">MI COMUNIDAD</span>
            <strong>Soy Vecino</strong>
            <p>
              Consulta gastos, incidencias, contratos y reservas.
            </p>
            <span className="heroAccessArrow">Acceder →</span>
          </a>
        </div>

          <div className="heroStats">
            <div>
              <strong>120</strong>
              <span>comunidades</span>
            </div>

            <div>
              <strong>+7.000</strong>
              <span>gastos analizados</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>información centralizada</span>
            </div>
          </div>
        </div>

        <div className="heroPreview">
          <div className="previewHeader">
            <div>
              <p>Resumen de cartera</p>
              <span>Urbalia Gestión</span>
            </div>

            <div className="statusDot"></div>
          </div>

          <div className="previewCards">
            <div className="miniCard">
              <span>Comunidades</span>
              <strong>120</strong>
            </div>

            <div className="miniCard alert">
              <span>Con alertas</span>
              <strong>14</strong>
            </div>

            <div className="miniCard">
              <span>Incidencias abiertas</span>
              <strong>23</strong>
            </div>
          </div>

          <div className="alertBox">
            <div>
              <span className="alertLabel">Alerta detectada</span>
              <h3>Jardines del Norte</h3>
              <p>
                Gasto de mantenimiento un 18,4 % superior a comunidades
                similares.
              </p>
            </div>

            <span className="alertPercentage">+18,4%</span>
          </div>

          <div className="chartMock">
            <div className="chartHeader">
              <span>Evolución de gastos</span>
              <span>2026</span>
            </div>

            <div className="bars">
              <div style={{ height: "42%" }}></div>
              <div style={{ height: "57%" }}></div>
              <div style={{ height: "48%" }}></div>
              <div style={{ height: "68%" }}></div>
              <div style={{ height: "62%" }}></div>
              <div style={{ height: "82%" }}></div>
              <div style={{ height: "73%" }}></div>
            </div>
          </div>
        </div>
      </section>
      <section id="problema" className="section">
  <div className="sectionIntro">
    <p className="sectionEyebrow">El problema</p>
    <h2>
      Gestionar muchas comunidades significa trabajar con información
      dispersa y difícil de comparar.
    </h2>
    <p>
      Gastos, proveedores, incidencias y contratos suelen analizarse
      comunidad por comunidad. Eso hace más difícil detectar desviaciones,
      comparar resultados y priorizar decisiones.
    </p>
  </div>

  <div className="problemGrid">
    <article className="problemCard">
      <span>01</span>
      <h3>Información dispersa</h3>
      <p>
        Cada comunidad genera datos diferentes y no siempre están
        centralizados en un único lugar.
      </p>
    </article>

    <article className="problemCard">
      <span>02</span>
      <h3>Difícil comparar</h3>
      <p>
        Una comunidad puede estar gastando más de lo habitual sin que sea
        evidente frente a comunidades similares.
      </p>
    </article>

    <article className="problemCard">
      <span>03</span>
      <h3>Decisiones reactivas</h3>
      <p>
        Los problemas se detectan tarde porque falta una visión global de
        toda la cartera gestionada.
      </p>
    </article>
  </div>
</section>

<section className="section howSection">
  <div className="sectionIntro">
    <p className="sectionEyebrow">Cómo funciona</p>
    <h2>De datos dispersos a decisiones más claras.</h2>
    <p>
      MyResidential centraliza la información de cada comunidad y la
      transforma en métricas, comparaciones y alertas útiles.
    </p>
  </div>

  <div className="stepsGrid">
    <article className="stepCard">
      <div className="stepNumber">1</div>
      <h3>Centraliza</h3>
      <p>
        Gastos, contratos, proveedores, incidencias y reservas en una única
        plataforma.
      </p>
    </article>

    <article className="stepCard">
      <div className="stepNumber">2</div>
      <h3>Compara</h3>
      <p>
        Analiza cada comunidad frente a otras con características similares.
      </p>
    </article>

    <article className="stepCard">
      <div className="stepNumber">3</div>
      <h3>Detecta</h3>
      <p>
        Identifica desviaciones de gasto, incidencias y oportunidades de
        mejora.
      </p>
    </article>

    <article className="stepCard">
      <div className="stepNumber">4</div>
      <h3>Actúa</h3>
      <p>
        El administrador sabe dónde prestar atención y puede tomar decisiones
        con mayor contexto.
      </p>
    </article>
  </div>
</section>
  <section id="modelo-datos" className="section dataModelSection">
  <div className="sectionIntro">
    <p className="sectionEyebrow">Arquitectura de datos</p>
    <h2>Todo MyResidential parte de un modelo de datos conectado.</h2>
    <p>
      La información de administradores y vecinos se integra en un modelo
      relacional alojado en Azure SQL, con la comunidad como entidad central.
    </p>
  </div>

  <div className="erDiagram">

    <div className="erMainEntity">
      <span className="erEntityType">ENTIDAD CENTRAL</span>
      <h3>COMUNIDADES</h3>
      <div className="erFields">
        <strong>PK · comunidad_id</strong>
        <span>nombre</span>
        <span>numero_viviendas</span>
        <span>anio_construccion</span>
        <span>ascensores · piscina · garaje</span>
        <span>jardin · conserjeria</span>
      </div>
    </div>

    <div className="erConnector">
      <span>1</span>
      <div></div>
      <span>N</span>
    </div>

    <div className="erEntitiesGrid">

      <article className="erEntity">
        <div className="erEntityHeader">
          <span>🏠</span>
          <h3>VIVIENDAS</h3>
        </div>
        <div className="erFields">
          <strong>PK · vivienda_id</strong>
          <b>FK · comunidad_id</b>
          <span>portal · planta · puerta</span>
          <span>metros_cuadrados</span>
        </div>
      </article>

      <article className="erEntity">
        <div className="erEntityHeader">
          <span>€</span>
          <h3>GASTOS</h3>
        </div>
        <div className="erFields">
          <strong>PK · gasto_id</strong>
          <b>FK · comunidad_id</b>
          <b>FK · proveedor_id</b>
          <span>categoria · concepto</span>
          <span>importe · fecha</span>
        </div>
      </article>

      <article className="erEntity">
        <div className="erEntityHeader">
          <span>!</span>
          <h3>INCIDENCIAS</h3>
        </div>
        <div className="erFields">
          <strong>PK · incidencia_id</strong>
          <b>FK · comunidad_id</b>
          <b>FK · proveedor_id</b>
          <span>tipo · estado · prioridad</span>
          <span>fecha_apertura · fecha_cierre</span>
        </div>
      </article>

      <article className="erEntity">
        <div className="erEntityHeader">
          <span>▣</span>
          <h3>CONTRATOS</h3>
        </div>
        <div className="erFields">
          <strong>PK · contrato_id</strong>
          <b>FK · comunidad_id</b>
          <b>FK · proveedor_id</b>
          <span>servicio · importe_anual</span>
          <span>fecha_inicio · fecha_fin</span>
        </div>
      </article>

      <article className="erEntity">
        <div className="erEntityHeader">
          <span>⚙</span>
          <h3>PROVEEDORES</h3>
        </div>
        <div className="erFields">
          <strong>PK · proveedor_id</strong>
          <span>nombre</span>
          <span>categoria</span>
          <span>telefono · email</span>
        </div>
      </article>

    </div>

    <div className="erResidentArea">
      <div className="erAreaTitle">
        <span>PORTAL DEL VECINO</span>
        <p>
          Cada vecino accede a los servicios asociados a su vivienda y comunidad.
        </p>
      </div>

      <div className="erResidentFlow">
        <div className="erFlowNode">
          <span>👤</span>
          <strong>VECINO</strong>
          <small>Usuario de la vivienda</small>
        </div>

        <span className="erArrow">→</span>

        <div className="erFlowNode">
          <span>🏠</span>
          <strong>VIVIENDA</strong>
          <small>vivienda_id</small>
        </div>

        <span className="erArrow">→</span>

        <div className="erResidentEntities">
          <article className="erSmallEntity">
            <strong>RESERVAS</strong>
            <span>PK · reserva_id</span>
            <span>FK · vivienda_id</span>
            <span>espacio · fecha · hora</span>
          </article>

          <article className="erSmallEntity">
            <strong>ANUNCIOS</strong>
            <span>PK · anuncio_id</span>
            <span>FK · vivienda_id</span>
            <span>titular · texto</span>
          </article>
        </div>
      </div>
    </div>

    <div className="analyticsLayer">
      <div className="analyticsIntro">
        <span className="analyticsBadge">CAPA ANALÍTICA</span>
        <h3>De la base de datos al benchmarking</h3>
        <p>
          Los datos operacionales se procesan para generar métricas que
          permiten comparar comunidades similares y detectar desviaciones.
        </p>
      </div>

      <div className="analyticsFlow">
        <div>
          <strong>Azure SQL</strong>
          <span>Datos operacionales</span>
        </div>

        <span>→</span>

        <div>
          <strong>Python + Pandas</strong>
          <span>Análisis y segmentación</span>
        </div>

        <span>→</span>

        <div>
          <strong>Benchmarking</strong>
          <span>Comunidades comparables</span>
        </div>

        <span>→</span>

        <div>
          <strong>MyResidential</strong>
          <span>Alertas y decisiones</span>
        </div>
      </div>

      <div className="analyticsTables">
        <span>benchmark_comunidades</span>
        <span>benchmark_categorias</span>
      </div>
    </div>

  </div>
</section>  
    <section id="funcionalidades" className="section featuresSection">
  <div className="sectionIntro">
    <p className="sectionEyebrow">Funcionalidades</p>
    <h2>Una plataforma, dos experiencias.</h2>
    <p>
      MyResidential adapta la información a cada tipo de usuario:
      el administrador analiza y decide; el vecino consulta, comunica
      y gestiona su comunidad.
    </p>
  </div>

  <div className="userExperienceGrid">
    <article id="administrador" className="experienceCard adminCard">
      <div className="experienceTop">
        <div>
          <span className="roleBadge">Administrador</span>
          <h3>Control global de todas tus comunidades.</h3>
        </div>

        <span className="experienceNumber">01</span>
      </div>

      <p className="experienceText">
        Detecta desviaciones, compara comunidades similares y localiza
        rápidamente dónde necesitas actuar.
      </p>

      <div className="featureList">
        <div>
          <strong>Dashboard general</strong>
          <span>KPIs y alertas de toda la cartera.</span>
        </div>

        <div>
          <strong>Comparador de comunidades</strong>
          <span>Benchmarking según tamaño y características.</span>
        </div>

        <div>
          <strong>Análisis de gastos</strong>
          <span>Identifica categorías con costes superiores a la media.</span>
        </div>

        <div>
          <strong>Proveedores</strong>
          <span>Compara costes y servicios entre comunidades.</span>
        </div>

        <div>
          <strong>Incidencias</strong>
          <span>Controla prioridades, estados y tiempos de resolución.</span>
        </div>

        <div>
          <strong>Contratos</strong>
          <span>Consulta importes, vigencias y próximos vencimientos.</span>
        </div>
      </div>

      <a href="/administrador" className="experienceButton">
        Explorar panel administrador →
      </a>
    </article>

    <article id="vecino" className="experienceCard residentCard">
      <div className="experienceTop">
        <div>
          <span className="roleBadge">Vecino</span>
          <h3>Tu comunidad, más clara y accesible.</h3>
        </div>

        <span className="experienceNumber">02</span>
      </div>

      <p className="experienceText">
        Accede a la información de tu comunidad y realiza las gestiones
        habituales desde un único lugar.
      </p>

      <div className="featureList">
        <div>
          <strong>Resumen de la comunidad</strong>
          <span>Avisos, incidencias y próximas reservas.</span>
        </div>

        <div>
          <strong>Gastos</strong>
          <span>Consulta cómo se distribuye el gasto comunitario.</span>
        </div>

        <div>
          <strong>Incidencias</strong>
          <span>Comunica problemas y consulta su estado.</span>
        </div>

        <div>
          <strong>Reservas</strong>
          <span>Gestiona pista de pádel, tenis y sala comunitaria.</span>
        </div>

        <div>
          <strong>Contratos</strong>
          <span>Consulta los principales servicios de la comunidad.</span>
        </div>

        <div>
          <strong>Comunicaciones</strong>
          <span>Recibe avisos y novedades importantes.</span>
        </div>
      </div>

      <a href="/vecino" className="experienceButton">
        Explorar panel vecino →
      </a>
    </article>
  </div>
</section>
    <section className="section insightSection">
  <div className="sectionIntro">
    <p className="sectionEyebrow">Inteligencia aplicada</p>
    <h2>No solo muestra datos. Te dice dónde mirar.</h2>
    <p>
      MyResidential compara cada comunidad con otras de características
      similares para detectar desviaciones relevantes de gasto e incidencias.
    </p>
  </div>

  <div className="insightGrid">
    <div className="insightCard">
      <div className="insightHeader">
        <div>
          <span className="insightBadge">Alerta de gasto</span>
          <h3>Comunidad Jardines del Norte</h3>
          <p>124 viviendas · Piscina · Garaje · 3 ascensores</p>
        </div>

        <div className="insightAlertValue">
          +14,6%
        </div>
      </div>

      <div className="comparisonBox">
        <div>
          <span>Gasto por vivienda</span>
          <strong>471 €</strong>
        </div>

        <div className="comparisonDivider"></div>

        <div>
          <span>Media comunidades similares</span>
          <strong>411 €</strong>
        </div>
      </div>

      <div className="categoryComparison">
        <div className="categoryRow">
          <div>
            <strong>Limpieza</strong>
            <span>+4%</span>
          </div>
          <div className="progressTrack">
            <div className="progressFill small"></div>
          </div>
        </div>

        <div className="categoryRow">
          <div>
            <strong>Ascensores</strong>
            <span className="warningText">+23%</span>
          </div>
          <div className="progressTrack">
            <div className="progressFill high"></div>
          </div>
        </div>

        <div className="categoryRow">
          <div>
            <strong>Jardinería</strong>
            <span>-6%</span>
          </div>
          <div className="progressTrack">
            <div className="progressFill low"></div>
          </div>
        </div>

        <div className="categoryRow">
          <div>
            <strong>Electricidad</strong>
            <span className="warningText">+11%</span>
          </div>
          <div className="progressTrack">
            <div className="progressFill medium"></div>
          </div>
        </div>
      </div>
    </div>

    <div className="insightExplanation">
      <div className="explanationItem">
        <span>01</span>
        <div>
          <h3>Compara de forma justa</h3>
          <p>
            No compara todas las comunidades entre sí. Tiene en cuenta
            tamaño, instalaciones y características.
          </p>
        </div>
      </div>

      <div className="explanationItem">
        <span>02</span>
        <div>
          <h3>Detecta desviaciones</h3>
          <p>
            Identifica dónde el gasto se aleja de lo habitual dentro de un
            grupo comparable.
          </p>
        </div>
      </div>

      <div className="explanationItem">
        <span>03</span>
        <div>
          <h3>Ayuda a priorizar</h3>
          <p>
            El administrador puede centrarse primero en las comunidades y
            categorías que requieren atención.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
    <section id="demo" className="ctaSection">
  <div className="ctaContent">
    <p className="sectionEyebrow">Demo MyResidential</p>

    <h2>
      Convierte la gestión de comunidades en decisiones basadas en datos.
    </h2>

    <p>
      Explora una demostración del panel de administración y descubre cómo
      MyResidential ayuda a detectar desviaciones, comparar comunidades y
      centralizar la gestión.
    </p>

    <div className="ctaButtons">
      <a href="/administrador" className="ctaPrimary">
        Acceder como administrador
      </a>

      <a href="/vecino" className="ctaSecondary">
        Acceder como vecino
      </a>
    </div>
  </div>
</section>

<footer className="footer">
  <div className="footerInner">
    <div>
      <div className="footerLogo">MyResidential</div>
      <p>
        Plataforma de gestión y análisis de datos para comunidades
        residenciales.
      </p>
    </div>

    <div className="footerLinks">
      <a href="#problema">Problema</a>
      <a href="#funcionalidades">Funcionalidades</a>
      <a href="#administrador">Administrador</a>
      <a href="#vecino">Vecino</a>
    </div>

    <div className="footerMeta">
      <span>Proyecto Data Science</span>
      <span>2026</span>
    </div>
  </div>
</footer>
    </main>
  );
}