// script.js

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ANIMAÇÃO DE SCROLL SUAVE =====
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Atualiza a URL sem recarregar a página
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // ===== HEADER FIXO COM EFEITO DE TRANSPARÊNCIA =====
    function initHeaderScroll() {
        const header = document.getElementById('header');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Efeito de esconder/mostrar o header no scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            // Adiciona sombra quando scrolado
            if (scrollTop > 50) {
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                header.style.background = '#fff';
                header.style.backdropFilter = 'none';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // ===== ANIMAÇÃO DE ELEMENTOS AO SCROLL =====
    function initScrollAnimation() {
        const animatedElements = document.querySelectorAll('.produto-card, .artigo-card, .btn-produto');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    // ===== VALIDAÇÃO DE FORMULÁRIO MELHORADA =====
    function initFormValidation() {
        const form = document.getElementById('whatsapp-form');
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            // Validação em tempo real
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        function validateField(field) {
            const value = field.value.trim();
            
            if (field.hasAttribute('required') && !value) {
                showError(field, 'Este campo é obrigatório.');
                return false;
            }
            
            if (field.type === 'tel' && value) {
                const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
                if (!phoneRegex.test(value)) {
                    showError(field, 'Digite um telefone válido.');
                    return false;
                }
            }
            
            clearError(field);
            return true;
        }
        
        function showError(field, message) {
            clearError(field);
            field.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#e74c3c';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '5px';
            errorDiv.textContent = message;
            
            field.parentNode.appendChild(errorDiv);
        }
        
        function clearError(field) {
            field.classList.remove('error');
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    }

    // ===== CONTADOR DE PRODUTOS VISUALIZADOS =====
    function initProductViewCounter() {
        const productCards = document.querySelectorAll('.produto-card');
        
        productCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const productName = this.querySelector('h3').textContent;
                console.log(`Produto visualizado: ${productName}`);
                // Aqui você pode enviar para o Google Analytics ou outro sistema de tracking
            });
        });
    }

    // ===== BOTÃO "VOLTAR AO TOPO" =====
    function initBackToTopButton() {
        const backToTopButton = document.createElement('button');
        backToTopButton.innerHTML = '↑';
        backToTopButton.style.position = 'fixed';
        backToTopButton.style.bottom = '90px';
        backToTopButton.style.right = '20px';
        backToTopButton.style.zIndex = '999';
        backToTopButton.style.width = '50px';
        backToTopButton.style.height = '50px';
        backToTopButton.style.borderRadius = '50%';
        backToTopButton.style.background = 'linear-gradient(to right, #67DA24, #9B0CF2)';
        backToTopButton.style.color = 'white';
        backToTopButton.style.border = 'none';
        backToTopButton.style.cursor = 'pointer';
        backToTopButton.style.opacity = '0';
        backToTopButton.style.transition = 'opacity 0.3s ease';
        backToTopButton.style.fontSize = '1.2rem';
        backToTopButton.style.boxShadow = '0 4px 15px rgba(103, 218, 36, 0.3)';
        
        document.body.appendChild(backToTopButton);
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.style.opacity = '1';
            } else {
                backToTopButton.style.opacity = '0';
            }
        });
    }

    // ===== CARREGAMENTO DE MAIS PRODUTOS (LAZY LOAD) =====
    function initLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const product = entry.target;
                    const img = product.querySelector('img');
                    if (img && img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(product);
                }
            });
        });
        
        // Observar produtos para lazy loading (se houver imagens)
        document.querySelectorAll('.produto-card').forEach(card => {
            observer.observe(card);
        });
    }

    // ===== CONTADOR DE TEMPO NO SITE =====
    function initTimeCounter() {
        let startTime = Date.now();
        
        window.addEventListener('beforeunload', function() {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            console.log(`Tempo gasto no site: ${timeSpent} segundos`);
            // Aqui você pode enviar esses dados para analytics
        });
    }

    // ===== MENU MOBILE =====
    function initMobileMenu() {
        const menuToggle = document.createElement('button');
        menuToggle.innerHTML = '☰';
        menuToggle.style.display = 'none';
        menuToggle.style.background = 'linear-gradient(to right, #67DA24, #9B0CF2)';
        menuToggle.style.color = 'white';
        menuToggle.style.border = 'none';
        menuToggle.style.borderRadius = '5px';
        menuToggle.style.padding = '10px 15px';
        menuToggle.style.cursor = 'pointer';
        menuToggle.style.fontSize = '1.2rem';
        
        const headerContainer = document.querySelector('.header-container');
        headerContainer.appendChild(menuToggle);
        
        const nav = document.querySelector('nav');
        
        function checkMobile() {
            if (window.innerWidth <= 768) {
                menuToggle.style.display = 'block';
                nav.style.display = 'none';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.background = 'white';
                nav.style.padding = '1rem';
                nav.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
            } else {
                menuToggle.style.display = 'none';
                nav.style.display = 'block';
                nav.style.position = 'static';
                nav.style.background = 'transparent';
                nav.style.padding = '0';
                nav.style.boxShadow = 'none';
            }
        }
        
        menuToggle.addEventListener('click', function() {
            const isVisible = nav.style.display === 'block';
            nav.style.display = isVisible ? 'none' : 'block';
        });
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
    }

    // ===== INICIALIZAR TODAS AS FUNCIONALIDADES =====
    function initAll() {
        initSmoothScroll();
        initHeaderScroll();
        initScrollAnimation();
        initFormValidation();
        initProductViewCounter();
        initBackToTopButton();
        initLazyLoading();
        initTimeCounter();
        initMobileMenu();
        
        console.log('🚀 Atemóia Store - JavaScript carregado com sucesso!');
    }

    // Inicializar tudo
    initAll();

});

// ===== FUNÇÃO DE REDIRECIONAMENTO WHATSAPP (EXISTENTE) - OTIMIZADA =====
function redirectToWhatsApp() {
    const nome = document.getElementById('nome')?.value.trim();
    const telefone = document.getElementById('telefone')?.value.trim();
    const tempoCorrida = document.getElementById('tempo-corrida')?.value;
    
    // Validação adicional
    if (!nome || !telefone || !tempoCorrida) {
        showNotification('Por favor, preencha todos os campos do formulário.', 'error');
        return;
    }
    
    // Formatar telefone
    const formattedPhone = telefone.replace(/\D/g, '');
    
    const mensagem = `Olá, vim pelo *site de afiliado Atemóia Store* e eu gostaria de saber mais.%0A%0A*Nome:* ${nome}%0A*Telefone:* ${telefone}%0A*Tempo de corrida:* ${tempoCorrida}`;
    const whatsappNumber = '5511968460946';
    
    // Abrir WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${mensagem}`, '_blank');
    
    // Limpar formulário
    document.getElementById('whatsapp-form').reset();
    
    // Mostrar confirmação
    showNotification('Mensagem enviada com sucesso! Em breve entraremos em contato.', 'success');
}

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.zIndex = '10000';
    notification.style.fontWeight = '500';
    notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    
    if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else if (type === 'success') {
        notification.style.background = '#2ecc71';
    } else {
        notification.style.background = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Esconder após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}