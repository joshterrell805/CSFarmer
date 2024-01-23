import net.csfarmer.CSF

plugins {
    id("csf-application-plugin")
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${CSF.DependencyVersions.kotlinCoroutinesCore}")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:${CSF.DependencyVersions.jacksonModuleKotlin}")
    implementation("io.ktor:ktor-server-netty:${CSF.DependencyVersions.ktor}")
    implementation("org.postgresql:postgresql:${CSF.DependencyVersions.postgresql}")
    implementation("com.zaxxer:HikariCP:${CSF.DependencyVersions.hikaricp}")

    testImplementation("io.ktor:ktor-client-core:${CSF.DependencyVersions.ktor}")
    testImplementation("io.ktor:ktor-client-cio:${CSF.DependencyVersions.ktor}")
    testImplementation("io.mockk:mockk:${CSF.TestDependencyVersions.mockk}")
    testImplementation("org.junit.jupiter:junit-jupiter-params:${CSF.TestDependencyVersions.junit}")
}