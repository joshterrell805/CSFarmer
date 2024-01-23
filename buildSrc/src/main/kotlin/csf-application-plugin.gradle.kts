import net.csfarmer.CSF

private val mainClassName = "net.csfarmer.MainKt"

plugins {
    kotlin("jvm")
    application
    id("com.github.johnrengelman.shadow")
}

application {
    mainClass.set(mainClassName)
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(CSF.DependencyVersions.jvm)
}

tasks.jar {
    manifest.attributes["Main-Class"] = mainClassName
}

tasks.run<JavaExec> {
    // pass along any properties set with -D flag on command line
    systemProperties(System.getProperties() as Map<String, Any>)
}