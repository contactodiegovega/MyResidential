import Link from "next/link";

export default function Administrador() {
  return (
    <div className="adminLayout">

      <aside className="sidebar">
        <Link href="/" className="sidebarLogo">
          MyResidential
        </Link>

        <div className="sidebarClient">
          <span>Administrador</span>
          <strong>Urbalia Gestión</strong>
        </div>

        <nav className="sidebarNav">
        <Link className="active" href="/administrador">
            Inicio
        </Link>

        <Link href="/administrador/comunidades">
            Comunidades
        </Link>

        <Link href="/administrador/gastos">
            Gastos
        </Link>

        <Link href="/administrador/proveedores">
            Proveedores
        </Link>

        <Link href="/administrador/incidencias">
            Incidencias
        </Link>

        <Link href="/administrador/contratos">
            Contratos
        </Link>
        </nav>

        <div className="sidebarBottom">
          <Link href="/">← Volver a MyResidential</Link>
        </div>
      </aside>

      <main className="adminMain">

        <header className="adminHeader">
          <div>
            <p className="adminEyebrow">Panel de administración</p>
            <h1>Buenos días, Urbalia.</h1>
            <p>
              Este es el estado general de las comunidades que gestionas.
            </p>
          </div>

          <div className="adminProfile">
            <div className="profileAvatar">UG</div>
            <div>
              <strong>Urbalia Gestión</strong>
              <span>Administrador</span>
            </div>
          </div>
        </header>

        <section className="adminKpis">
          <article className="adminKpi">
            <span>Comunidades</span>
            <strong>120</strong>
            <small>Cartera gestionada</small>
          </article>

          <article className="adminKpi">
            <span>Alertas detectadas</span>
            <strong>14</strong>
            <small>Requieren revisión</small>
          </article>

          <article className="adminKpi">
            <span>Incidencias abiertas</span>
            <strong>23</strong>
            <small>5 de prioridad alta</small>
          </article>

          <article className="adminKpi">
            <span>Contratos próximos a vencer</span>
            <strong>8</strong>
            <small>Próximos 60 días</small>
          </article>
        </section>

        <section className="adminDashboardGrid">

          <div className="adminPanel alertsPanel">
            <div className="panelTitle">
              <div>
                <h2>Comunidades que requieren atención</h2>
                <p>Desviaciones detectadas frente a comunidades similares.</p>
              </div>

              <button>Ver todas</button>
            </div>

            <div className="dashboardAlert">
              <div className="dashboardAlertIcon">!</div>

              <div className="dashboardAlertContent">
                <strong>Jardines del Norte</strong>
                <span>
                  Gasto por vivienda superior al grupo comparable.
                </span>
              </div>

              <div className="dashboardAlertValue">
                +18,4%
              </div>
            </div>

            <div className="dashboardAlert">
              <div className="dashboardAlertIcon">!</div>

              <div className="dashboardAlertContent">
                <strong>Residencial Castellana</strong>
                <span>
                  Coste de ascensores superior a comunidades similares.
                </span>
              </div>

              <div className="dashboardAlertValue">
                +23,1%
              </div>
            </div>

            <div className="dashboardAlert">
              <div className="dashboardAlertIcon">!</div>

              <div className="dashboardAlertContent">
                <strong>Parque del Retiro</strong>
                <span>
                  Mayor número de incidencias por vivienda.
                </span>
              </div>

              <div className="dashboardAlertValue">
                +16,8%
              </div>
            </div>
          </div>

          <div className="adminPanel portfolioPanel">
            <div className="panelTitle">
              <div>
                <h2>Estado de la cartera</h2>
                <p>Distribución de comunidades.</p>
              </div>
            </div>

            <div className="portfolioChart">
              <div className="donutChart">
                <div className="donutCenter">
                  <strong>120</strong>
                  <span>comunidades</span>
                </div>
              </div>

              <div className="portfolioLegend">
                <div>
                  <span className="legendDot stable"></span>
                  <p>Sin alertas</p>
                  <strong>106</strong>
                </div>

                <div>
                  <span className="legendDot warning"></span>
                  <p>Con alertas</p>
                  <strong>14</strong>
                </div>
              </div>
            </div>
          </div>

        </section>

        <section className="adminPanel communitiesPanel">
          <div className="panelTitle">
            <div>
              <h2>Resumen de comunidades</h2>
              <p>Principales indicadores de la cartera.</p>
            </div>

            <button>Ver comunidades</button>
          </div>

          <div className="communityTable">
            <div className="communityTableHeader">
              <span>Comunidad</span>
              <span>Viviendas</span>
              <span>Gasto / vivienda</span>
              <span>Comparativa</span>
              <span>Estado</span>
            </div>

            <div className="communityTableRow">
              <strong>Jardines del Norte</strong>
              <span>124</span>
              <span>471 €</span>
              <span className="negativeMetric">+18,4%</span>
              <span className="statusWarning">Revisar</span>
            </div>

            <div className="communityTableRow">
              <strong>Residencial Castellana</strong>
              <span>86</span>
              <span>438 €</span>
              <span className="negativeMetric">+12,7%</span>
              <span className="statusWarning">Revisar</span>
            </div>

            <div className="communityTableRow">
              <strong>Torres de Chamartín</strong>
              <span>102</span>
              <span>396 €</span>
              <span className="positiveMetric">-2,3%</span>
              <span className="statusOk">Normal</span>
            </div>

            <div className="communityTableRow">
              <strong>Residencial Velázquez</strong>
              <span>64</span>
              <span>401 €</span>
              <span>+1,1%</span>
              <span className="statusOk">Normal</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}